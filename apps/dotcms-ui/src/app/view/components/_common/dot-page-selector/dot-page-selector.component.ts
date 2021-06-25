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
    searchType: string;
    private currentHost: Site;

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
        const query = this.cleanAndValidateQuery(param.query);
        if (!!query) {
            this.handleSearchType(query)
                .pipe(take(1))
                .subscribe((data) => {
                    this.suggestions.next(data);
                    this.autoComplete.show();
                    this.emptyMessage = !!data.length ? null : this.getEmptyMessage();
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
    }

    private conditionalSearch(param: string): Observable<DotPageSelectorItem[]> {
        return this.isSearchingForHost(param)
            ? this.dotPageSelectorService.getSites(this.getSiteName(param)).pipe(
                  tap(() => {
                      this.searchType = 'site';
                  })
              )
            : this.getSecondStepData(param);
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
        return (
            param.startsWith('//') &&
            param.length > 2 &&
            (this.isHostAndPath(param) || param.endsWith('/'))
        );
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
    }

    private isSearchingForHost(query: string): boolean {
        return query.startsWith('//') && !!this.getSiteName(query) ? !query.endsWith('/') : true;
    }

    private getSiteName(site: string): string {
        return site.replace(/\//g, '');
    }

    private resetResults(): void {
        this.suggestions.next(of([]));
    }

    private cleanAndValidateQuery(query: string): string {
        const cleanedQuery = this.cleanQuery(query);
        this.autoComplete.inputEL.nativeElement.value = cleanedQuery;
        return cleanedQuery.startsWith('//')
            ? cleanedQuery
            : cleanedQuery.length >= 3
            ? cleanedQuery
            : '';
    }

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
