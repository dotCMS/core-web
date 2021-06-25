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

import { switchMap, take, tap } from 'rxjs/operators';

import { Site } from '@dotcms/dotcms-js';

import { DotPageSelectorService, DotPageAsset } from './service/dot-page-selector.service';
import { DotPageSelectorItem, DotFolder, DotSimpleURL } from './models/dot-page-selector.models';
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

    val: DotPageSelectorItem;
    suggestions: Subject<any> = new Subject<any>();
    emptyMessage: string;
    private currentHost: Site;
    private searchType: string;

    constructor(
        private dotPageSelectorService: DotPageSelectorService,
        private dotMessageService: DotMessageService
    ) {
        this.suggestions.subscribe((data) => {
            console.log('suggestions: ', data);
            this.autoComplete.show();
        });
    }

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
        const query = this.cleanAndValidateQuery(param.query);
        console.log('search', query);
        if (!!query) {
            this.handleSearchType(query)
                .pipe(take(1))
                .subscribe((data) => {
                    this.suggestions.next(data);
                    this.emptyMessage = !!data.length ? null : this.getEmptyMessage();
                    // if (data.length === 1 && this.isSearchingForHost(query)) {
                    //     console.log('autoSelectUniqueResult');
                    //     this.autoSelectUniqueResult(data[0]);
                    // }
                    // if ( this.shouldAutoFill() && this.isOnlyFullHost(query)) {
                    //     this.autoSelectUniqueResult();
                    // }
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
            this.selected.emit(`//${folder.hostname}${folder.path}`);
            this.propagateChange(`//${folder.hostname}${folder.path}`);
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

        // if (this.shouldAutoFill()) {
        //     this.autoFillField($event);
        //     // this.autoSelectUniqueResult();
        // }
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
        console.log('isTwoStepSearch: ', this.isTwoStepSearch(query));
        if (this.isTwoStepSearch(query)) {
            return this.fullSearch(query);
        } else {
            this.currentHost = null;
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
                    return this.getSecondStepData(param);
                } else {
                    this.searchType = this.folderSearch ? 'folder' : 'site';
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
        return this.isSearchingForHost(param)
            ? this.dotPageSelectorService.getSites(this.getSiteName(param)).pipe(
                  tap(() => {
                      this.searchType = 'site';
                  })
              )
            : this.getSecondStepData(param);

        // return !this.currentHost || this.isReSearchingForHost(param)
        //     ? this.dotPageSelectorService.getSites(this.getSiteName(param)).pipe(
        //           tap(() => {
        //               this.searchType = 'site';
        //           })
        //       )
        //     : this.folderSearch
        //     ? this.dotPageSelectorService.getFolders(param).pipe(
        //           tap(() => {
        //               this.searchType = 'folder';
        //           })
        //       )
        //     : this.dotPageSelectorService.getPages(param).pipe(
        //           tap(() => {
        //               this.searchType = 'page';
        //           })
        //       );
    }

    private getSecondStepData(param: string): Observable<DotPageSelectorItem[]> {
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
    }

    private isTwoStepSearch(param: string): boolean {
        // return !!this.currentHost || this.hostChanged(param);
        return (
            param.startsWith('//') &&
            param.length > 2 &&
            (this.isHostAndPath(param) || param.endsWith('/'))
        );
        // return this.isHostAndPath(param) && (!this.currentHost || this.hostChanged(param));
    }

    private isHostAndPath(param: string): boolean {
        const url: DotSimpleURL | { [key: string]: string } = this.parseUrl(param);
        return url && !!(url.host && url.pathname.length > 0);
    }

    private parseUrl(query: string): DotSimpleURL {
        try {
            const url = new URL(`http:${query}`);
            return { host: url.host, pathname: url.pathname.substr(1) };
        } catch {
            return null;
        }

        // if (this.isSearchingForHost(query)) {
        //     try {
        //         const url = new URL(`http:${query}`);
        //         return {
        //             host: url.host,
        //             pathname:
        //                 query.endsWith('/') && url.pathname.length === 1
        //                     ? ' '
        //                     : url.pathname.substr(1)
        //         };
        //     } catch {
        //         return null;
        //     }
        // } else {
        //     return null;
        // }
    }

    private isSearchingForHost(query: string): boolean {
        return query.startsWith('//') && !!this.getSiteName(query) ? !query.endsWith('/') : true;
    }

    // private shouldSearchPages(query: string): boolean {
    //     debugger;
    //     if (!this.isHostAndPath(query) || this.isReSearchingForHost(query)) {
    //         this.currentHost = null;
    //     }
    //     console.log(!!(this.currentHost || !this.isSearchingForHost(query)));
    //     return !!(this.currentHost || !this.isSearchingForHost(query));
    // }

    // private isReSearchingForHost(query: string): boolean {
    //     console.log('hostChanged', this.hostChanged(query));
    //     if (this.isSearchingForHost(query) && this.hostChanged(query)) {
    //         this.currentHost = null;
    //         return true;
    //     }
    //     return false;
    // }

    // private hostChanged(query: string): boolean {
    //     const parsedURL = this.parseUrl(query);
    //     return (
    //         this.currentHost &&
    //         parsedURL &&
    //         this.currentHost.hostname.toLocaleLowerCase() !== parsedURL.host.toLocaleLowerCase()
    //     );
    // }

    private getSiteName(site: string): string {
        return site.replace(/\//g, '');
    }

    // private autoFillField($event: KeyboardEvent): void {
    //     const input: HTMLInputElement = <HTMLInputElement>$event.target;
    //
    //     if (this.searchType === 'site') {
    //         const host = <Site>this.autoComplete.suggestions[0].payload;
    //         input.value = `//${host.hostname}/`;
    //     } else if (this.searchType === 'page') {
    //         const page = <DotPageAsset>this.autoComplete.suggestions[0].payload;
    //         input.value = `//${page.hostName}/${page.path}`;
    //     } else if (this.searchType === 'folder') {
    //         const folder = <DotFolder>this.autoComplete.suggestions[0].payload;
    //         input.value = `//${folder.hostname}${folder.path}`;
    //     }
    //
    //     this.resetResults();
    // }

    // private shouldAutoFill(): boolean {
    //     debugger;
    //     return this.autoComplete.suggestions.length === 1;
    // }

    private resetResults(): void {
        this.suggestions.next(of([]));
    }

    // private getErrorMessage(): string {
    //     return this.results.data.length === 0 ? this.getEmptyMessage(this.results.type) : null;
    // }

    // private isOnlyFullHost(host: string): boolean {
    //     return /\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\/*$/.test(host);
    // }

    // private autoSelectUniqueResult(data: DotPageSelectorItem): void {
    //     this.onSelect(data);
    // }

    private cleanAndValidateQuery(query: string): string {
        const cleanedQuery = this.cleanQuery(query);
        this.autoComplete.inputEL.nativeElement.value = cleanedQuery;
        debugger;
        return cleanedQuery.startsWith('//')
            ? cleanedQuery
            : cleanedQuery.length >= 3
            ? cleanedQuery
            : '';

        // return !!cleanedQuery
        //     ? cleanedQuery.startsWith('//')
        //         ? cleanedQuery
        //         : cleanedQuery.length >= 3
        //         ? cleanedQuery
        //         : ''
        //     : '';
    }

    // private validSearch(param: any): boolean {
    //     return (
    //         this.cleanInput(param).length &&
    //         (param.query.startsWith('//') ? true : param.query.length >= 3)
    //     );
    // }

    // private cleanInput(event: any): string {
    //     this.autoComplete.inputEL.nativeElement.value = this.cleanQuery(event.query);
    //     return this.autoComplete.inputEL.nativeElement.value;
    // }

    private cleanQuery(query: string): string {
        return !NO_SPECIAL_CHAR.test(query) ? query.replace(REPLACE_SPECIAL_CHAR, '') : query;
    }

    private getEmptyMessage(): string {
        switch (this.searchType) {
            case 'site':
                return this.dotMessageService.get('page.selector.no.sites.results');
            case 'page':
                return this.dotMessageService.get('page.selector.no.page.results');
            case 'folder':
                return this.dotMessageService.get('page.selector.no.folder.results');
        }
    }
}
