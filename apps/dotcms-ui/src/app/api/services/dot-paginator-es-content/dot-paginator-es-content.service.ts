import { take, map } from 'rxjs/operators';
import { CoreWebService, ResponseView } from '@dotcms/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

/**
 * Provides util listing methods
 * @export
 * @class DotPaginatorESContentService
 */
@Injectable()
export class DotPaginatorESContentService {
    public paginationPerPage = 40;
    public currentPage: number = 1;
    public totalRecords: number;

    private _url = '/api/content/_search';
    private defaultQueryParams = { '+languageId': '1', '+deleted': 'false', '+working': 'true' };
    private _filter: string;
    private _sortField: string = 'modDate';
    private _sortOrder: OrderDirection = OrderDirection.ASC;
    private _extraParams: Map<string, any> = new Map(Object.entries(this.defaultQueryParams));

    constructor(private coreWebService: CoreWebService) {}

    get url(): string {
        return this._url;
    }

    set url(url: string) {
        if (this._url !== url) {
            this._url = url;
        }
    }

    get filter(): string {
        return this._filter;
    }

    set filter(filter: string) {
        if (this._filter !== filter) {
            this._filter = filter;
        }
    }

    get extraParams(): Map<string, any> {
        return this._extraParams;
    }

    get sortField(): string {
        return this._sortField;
    }

    set sortField(sortField: string) {
        if (this._sortField !== sortField) {
            this._sortField = sortField;
        }
    }

    get sortOrder(): OrderDirection {
        return this._sortOrder;
    }

    set sortOrder(sortOrder: OrderDirection) {
        if (this._sortOrder !== sortOrder) {
            this._sortOrder = sortOrder;
        }
    }

    /**
     * Set value of extra parameters of the eventual request.
     * @param string name
     * @param value
     *
     * @memberof DotThemeSelectorComponent
     */
    public setExtraParams(name: string, value?: any): void {
        if (value !== null && value !== undefined) {
            this.extraParams.set(name, value.toString());
        }
    }

    /**
     * Delete extra parameters of the eventual request.
     * @param string name
     *
     * @memberof DotThemeSelectorComponent
     */
    public deleteExtraParams(name: string): void {
        this.extraParams.delete(name);
    }

    /**
     * Send a pagination request with url as base URL, if url is null or undefined then
     * it use the url property value instead.
     * Also it use the values of sortField, sortOrder in the Body request
     * @param url base url
     */
    public get(url?: string): Observable<any> {
        const queryParams = this.getESQuery(this.getObjectFromMap(this.extraParams));

        return this.coreWebService
            .requestView({
                body: JSON.stringify(queryParams),
                method: 'POST',
                url: url || this.url
            })
            .pipe(
                map((response: ResponseView<any>) => {
                    this.totalRecords = response.entity?.resultsSize;
                    return response.entity?.jsonObjectView?.contentlets || null;
                }),
                take(1)
            );
    }

    /**
     * request the  pageParam page
     * @param number [pageParam=1] Page to request
     * @returns Observable<any[]>
     * @memberof PaginatorServic
     */
    public getPage(pageParam = 1): Observable<any[]> {
        this.currentPage = pageParam;
        return this.get();
    }

    /**
     * Request the current page
     * @returns Observable<any[]>
     * @memberof PaginatorService
     */
    public getCurrentPage(): Observable<any[]> {
        return this.getPage(this.currentPage);
    }

    /**
     * Use the offset to request a page.
     * @param number offset Offset to be request
     * @returns Observable<any[]>
     * @memberof PaginatorService
     */
    public getWithOffset(offset: number): Observable<any[]> {
        const page = this.getPageFromOffset(offset);
        return this.getPage(page);
    }

    private getESQuery(params: { [key: string]: any }): any {
        const query = {
            query: JSON.stringify(params).replace(/"|{|}|,/g, ' '),
            sort: `${this._sortField || ''} ${this._sortOrder || ''}`,
            limit: this.paginationPerPage,
            offset: (this.currentPage - 1) * this.paginationPerPage
        };

        return query;
    }

    private getPageFromOffset(offset: number): number {
        return parseInt(String(offset / this.paginationPerPage), 10) + 1;
    }

    private getObjectFromMap(map: Map<string, any>): { [key: string]: any } {
        let result = Array.from(map).reduce(
            (obj, [key, value]) => Object.assign(obj, { [key]: value }),
            {}
        );

        return result;
    }
}
