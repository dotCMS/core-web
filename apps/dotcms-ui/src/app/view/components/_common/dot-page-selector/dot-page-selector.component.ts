import {
    Component,
    Output,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { map, switchMap, take, tap } from 'rxjs/operators';

import { Site } from '@dotcms/dotcms-js';

import { DotPageSelectorService, DotPageAsset } from './service/dot-page-selector.service';
import {
    DotPageSelectorResults,
    DotPageSelectorItem,
    DotFolder,
    DotSimpleURL
} from './models/dot-page-selector.models';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { AutoComplete } from 'primeng/autocomplete';
import { of } from 'rxjs/internal/observable/of';
import { Observable, Subject } from 'rxjs';

const NO_SPECIAL_CHAR = /^[a-zA-Z0-9._/-]*$/g;
const REPLACE_SPECIAL_CHAR = /[^a-zA-Z0-9._/-]/g;

/**
 * Search and select a page asset
 *
 * @export
 * @class DotPageSelectorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-page-selector',
    templateUrl: './dot-page-selector.component.html',
    styleUrls: ['./dot-page-selector.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotPageSelectorComponent)
        }
    ]
})
export class DotPageSelectorComponent implements ControlValueAccessor {
    @Output() selected = new EventEmitter<DotPageAsset | string>();
    @Input() label: string;
    @Input() floatingLabel = false;
    @Input() folderSearch = false;

    @ViewChild('autoComplete') autoComplete: AutoComplete;

    // results: DotPageSelectorResults = {
    //     data: of([]),
    //     query: '',
    //     type: ''
    // };
    val: DotPageSelectorItem;
    message: string;
    suggestions: Subject<any> = new Subject<any>();
    private currentHost: Site;
    private searchType: string;

    constructor(
        private dotPageSelectorService: DotPageSelectorService,
        private dotMessageService: DotMessageService
    ) {}

    propagateChange = (_: any) => {};

    /**
     * Handle clear of the autocomplete
     *
     * @memberof DotPageSelectorComponent
     */
    onClear(): void {
        this.propagateChange(null);
        this.suggestions.next(of([]));
    }

    /**
     * Get results and set it to the autotomplete
     *
     * @param string param
     * @memberof DotPageSelectorComponent
     */
    search(param: any): void {
        console.log('search');
        if (this.validSearch(param)) {
            debugger;
            this.handleSearchType(this.cleanQuery(param.query))
                .pipe(take(1))
                .subscribe((data) => {
                    debugger;
                    this.suggestions.next(data);
                    if (
                        this.shouldAutoFill() &&
                        this.isOnlyFullHost(this.cleanQuery(param.query))
                    ) {
                        this.autoSelectUniqueResult();
                    }
                });
        } else {
            this.resetResults();
        }
    }

    /**
     * Handle option selected
     *
     * @param DotPageAsset item
     * @memberof DotPageSelectorComponent
     */
    onSelect(item: DotPageSelectorItem): void {
        console.log('onSelect');
        if (this.searchType === 'site') {
            const site: Site = <Site>item.payload;
            this.currentHost = site;
            this.autoComplete.completeMethod.emit({ query: `//${site.hostname}/` });
        } else if (this.searchType === 'page') {
            const page: DotPageAsset = <DotPageAsset>item.payload;
            this.selected.emit(page);
            this.propagateChange(page.identifier);
        } else if (this.searchType === 'folder') {
            const folder = <DotFolder>item.payload;
            this.selected.emit(`${folder.hostname}${folder.path}`);
            this.propagateChange(`${folder.hostname}${folder.path}`);
        }

        this.resetResults();
    }

    /**
     * Prevent enter to propagate on selection
     *
     * @param {KeyboardEvent} $event
     * @memberof DotTextareaContentComponent
     */
    onKeyEnter($event: KeyboardEvent): void {
        $event.stopPropagation();

        if (this.shouldAutoFill()) {
            this.autoFillField($event);
            this.autoSelectUniqueResult();
        }
    }

    /**
     * Write a new value to the element
     *
     * @param string idenfier
     * @memberof DotPageSelectorComponent
     */
    writeValue(idenfier: string): void {
        if (idenfier) {
            this.dotPageSelectorService
                .getPageById(idenfier)
                .pipe(take(1))
                .subscribe((item: DotPageSelectorItem) => {
                    this.val = item;
                });
        }
    }

    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param * fn
     * @memberof DotPageSelectorComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(_fn: any): void {}

    private handleSearchType(query: string): Observable<DotPageSelectorItem[]> {
        if (this.isTwoStepSearch(query)) {
            return this.fullSearch(query);
        } else {
            return this.conditionalSearch(query);
        }
    }

    private fullSearch(param: string): Observable<DotPageSelectorItem[]> {
        const host = this.parseUrl(param).host;
        return this.dotPageSelectorService.getSites(host, true).pipe(
            take(1),
            switchMap((results: DotPageSelectorItem[]) => {
                if (results.length) {
                    this.currentHost = <Site>results[0].payload;
                    return this.folderSearch
                        ? this.dotPageSelectorService.getFolders(param).pipe(
                              tap(() => {
                                  this.searchType = 'folder';
                              })
                          )
                        : this.dotPageSelectorService.getPages(param).pipe(
                              tap(() => {
                                  this.searchType = 'page';
                              })
                          );
                } else {
                    return of(results);
                }
            })
        );

        // return this.getSites(host, true).pipe(
        //     take(1),
        //     switchMap((results: DotPageSelectorResults) => {
        //         if (results.data.length) {
        //             this.setCurrentHost(<Site>results.data[0].payload);
        //             return this.isFolderSearch ? this.getFolders(param) : this.getPages(param);
        //         } else {
        //             return of(results);
        //         }
        //     })
        // );
    }

    private conditionalSearch(param: string): Observable<DotPageSelectorItem[]> {
        debugger;
        return !this.currentHost || this.isReSearchingForHost(param)
            ? this.dotPageSelectorService.getSites(this.getSiteName(param)).pipe(
                  tap(() => {
                      this.searchType = 'site';
                  })
              )
            : this.folderSearch
            ? this.dotPageSelectorService.getFolders(param).pipe(
                  tap(() => {
                      this.searchType = 'folder';
                  })
              )
            : this.dotPageSelectorService.getPages(param).pipe(
                  tap(() => {
                      this.searchType = 'page';
                  })
              );
    }

    private isTwoStepSearch(param): boolean {
        // return !!this.currentHost || this.hostChanged(param);
        return this.isHostAndPath(param) && (!this.currentHost || this.hostChanged(param));
    }

    private isHostAndPath(param: string): boolean {
        const url: DotSimpleURL | { [key: string]: string } = this.parseUrl(param);
        return url && !!(url.host && url.pathname.length > 0);
    }

    private parseUrl(query: string): DotSimpleURL {
        if (this.isSearchingForHost(query)) {
            try {
                const url = new URL(`http:${query}`);
                debugger;
                return {
                    host: url.host,
                    pathname:
                        query.endsWith('/') && url.pathname.length === 1
                            ? ' '
                            : url.pathname.substr(1)
                };
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    private isSearchingForHost(query: string): boolean {
        return query.startsWith('//') && !!this.getSiteName(query) ? !query.endsWith('/') : true;
    }

    private shouldSearchPages(query: string): boolean {
        debugger;
        if (!this.isHostAndPath(query) || this.isReSearchingForHost(query)) {
            this.currentHost = null;
        }
        console.log(!!(this.currentHost || !this.isSearchingForHost(query)));
        return !!(this.currentHost || !this.isSearchingForHost(query));
    }

    private isReSearchingForHost(query: string): boolean {
        console.log('hostChanged', this.hostChanged(query));
        if (this.isSearchingForHost(query) && this.hostChanged(query)) {
            this.currentHost = null;
            return true;
        }
        return false;
    }

    private hostChanged(query: string): boolean {
        const parsedURL = this.parseUrl(query);
        return (
            this.currentHost &&
            parsedURL &&
            this.currentHost.hostname.toLocaleLowerCase() !== parsedURL.host.toLocaleLowerCase()
        );
    }

    private getSiteName(site: string): string {
        return site.replace(/\//g, '');
    }

    private autoFillField($event: KeyboardEvent): void {
        const input: HTMLInputElement = <HTMLInputElement>$event.target;

        if (this.searchType === 'site') {
            const host = <Site>this.autoComplete.suggestions[0].payload;
            input.value = `//${host.hostname}/`;
        } else if (this.searchType === 'page') {
            const page = <DotPageAsset>this.autoComplete.suggestions[0].payload;
            input.value = `//${page.hostName}/${page.path}`;
        } else if (this.searchType === 'folder') {
            const folder = <DotFolder>this.autoComplete.suggestions[0].payload;
            input.value = `//${folder.hostname}${folder.path}`;
        }

        this.resetResults();
    }

    private shouldAutoFill(): boolean {
        debugger;
        return this.autoComplete.suggestions.length === 1;
    }

    private resetResults(): void {
        this.suggestions.next(of([]));
    }

    // private getErrorMessage(): string {
    //     return this.results.data.length === 0 ? this.getEmptyMessage(this.results.type) : null;
    // }

    private isOnlyFullHost(host: string): boolean {
        return /\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\/*$/.test(host);
    }

    private autoSelectUniqueResult(): void {
        this.onSelect(this.autoComplete.suggestions[0]);
    }

    private validSearch(param: any): boolean {
        return (
            this.cleanInput(param).length &&
            (!param.query.startsWith('//') ? param.query.length >= 3 : true)
        );
    }

    private cleanInput(event: any): string {
        this.autoComplete.inputEL.nativeElement.value = this.cleanQuery(event.query);
        return this.autoComplete.inputEL.nativeElement.value;
    }

    private cleanQuery(query: string): string {
        return !NO_SPECIAL_CHAR.test(query) ? query.replace(REPLACE_SPECIAL_CHAR, '') : query;
    }

    private getEmptyMessage(type: string): string {
        switch (type) {
            case 'site':
                return this.dotMessageService.get('page.selector.no.sites.results');
            case 'page':
                return this.dotMessageService.get('page.selector.no.page.results');
            case 'folder':
                return this.dotMessageService.get('page.selector.no.folder.results');
        }
    }
}
