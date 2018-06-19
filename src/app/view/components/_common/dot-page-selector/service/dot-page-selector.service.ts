import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { RequestMethod } from '@angular/http';

export interface DotPageAsset {
    template: string;
    owner: string;
    identifier: string;
    friendlyname: string;
    modDate: string;
    cachettl: string;
    pagemetadata: string;
    languageId: number;
    title: string;
    showOnMenu: string;
    inode: string;
    seodescription: string;
    folder: string;
    __DOTNAME__?: string;
    path?: string;
    sortOrder: number;
    seokeywords: string;
    modUser: string;
    host: string;
    lastReview: string;
    stInode: string;
    url?: string;
}

@Injectable()
export class DotPageSelectorService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get all the pages in the folder
     *
     * @param {string} searchParam
     * @returns {Observable<DotPageAsset[]>}
     * @memberof DotPageSelectorService
     */
    getPagesInFolder(searchParam: string): Observable<DotPageAsset[]> {
        return this.coreWebService
            .requestView({
                body: {
                    query: {
                        query_string: {
                            query: `+basetype:5 +parentpath:*${searchParam}*`
                        }
                    }
                },
                method: RequestMethod.Post,
                url: 'es/search'
            })
            .pluck('contentlets');
    }

    /**
     * Get a page by id
     *
     * @param {string} identifier
     * @memberof DotPageSelectorService
     */
    getPage(identifier: string): Observable<DotPageAsset> {
        return this.coreWebService
            .requestView({
                body: {
                    query: {
                        query_string: {
                            query: `+basetype:5 +identifier:${identifier}`
                        }
                    }
                },
                method: RequestMethod.Post,
                url: 'es/search'
            })
            .pluck('contentlets')
            .map((pages: DotPageAsset[]) => pages[0]);
    }
}
