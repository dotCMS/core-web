import { take, map } from 'rxjs/operators';
import { CoreWebService, ResponseView } from '@dotcms/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DotCMSContentlet } from '@dotcms/dotcms-models';

export interface queryEsParams {
    itemsPerPage?: number;
    filter?: string;
    lang?: string;
    offset?: number;
    query: string;
    sortField?: string;
    sortOrder?: string;
}

/**
 * Provides util listing methods to get contentlets data from Elastic Search endpoint
 * @export
 * @class DotPaginatorESContentService
 */
@Injectable()
export class DotPaginatorESContentService {
    paginationPerPage = 40;
    totalRecords: number;

    private _currentPage: number = 1;
    private _url = '/api/content/_search';
    private _defaultQueryParams = { '+languageId': '1', '+deleted': 'false', '+working': 'true' };
    private _sortField: string = 'modDate';
    private _sortOrder: string = 'ASC';
    private _extraParams: Map<string, string> = new Map(Object.entries(this._defaultQueryParams));

    constructor(private coreWebService: CoreWebService) {}

    public get(params: queryEsParams): Observable<DotCMSContentlet[]> {
        this.setBaseParams(params);
        this._currentPage = params.offset ? this.getPageFromOffset(params.offset) : 1;
        const queryParams = this.getESQuery(this.getObjectFromMap(this._extraParams));

        return this.coreWebService
            .requestView({
                body: JSON.stringify(queryParams),
                method: 'POST',
                url: this._url
            })
            .pipe(
                map((response: ResponseView<any>) => {
                    this.totalRecords = response.entity?.resultsSize;
                    return response.entity?.jsonObjectView?.contentlets || null;
                }),
                take(1)
            );
    }

    private setExtraParams(name: string, value?: string | number): void {
        if (value !== null && value !== undefined) {
            this._extraParams.set(name, value.toString());
        }
    }

    private deleteExtraParams(name: string): void {
        this._extraParams.delete(name);
    }

    private getESQuery(params: {
        [key: string]: string | number;
    }): { [key: string]: string | number } {
        const query = {
            query: JSON.stringify(params).replace(/"|{|}|,/g, ' '),
            sort: `${this._sortField || ''} ${this._sortOrder || ''}`,
            limit: this.paginationPerPage,
            offset: (this._currentPage - 1) * this.paginationPerPage
        };

        return query;
    }

    private setBaseParams(params: queryEsParams): void {
        this.paginationPerPage = params.itemsPerPage || this.paginationPerPage;
        this._sortField = params.sortField || this._sortField;
        this._sortOrder = params.sortOrder || this._sortOrder;
        this.deleteExtraParams('+languageId');
        this.deleteExtraParams('+title');

        // Getting values from Query string param
        const queryParamsArray = params.query.split('+').map((item) => {
            return item.split(':');
        });

        // Populating ExtraParams map
        queryParamsArray.forEach(([param, value]) => {
            if (param.length > 1) this.setExtraParams(`+${param}`, value);
        });

        if (params.lang) this.setExtraParams('+languageId', params.lang);

        let filterValue = '';
        if (params.filter && params.filter.indexOf(' ') > 0) {
            filterValue = `'${params.filter.replace(/'/g, "\\'")}'`;
        }
        this.setExtraParams('+title', `${filterValue || params.filter || ''}*`);
    }

    private getPageFromOffset(offset: number): number {
        return parseInt(String(offset / this.paginationPerPage), 10) + 1;
    }

    private getObjectFromMap(map: Map<string, string>): { [key: string]: string | number } {
        let result = Array.from(map).reduce(
            (obj, [key, value]) => Object.assign(obj, { [key]: value }),
            {}
        );

        return result;
    }
}
