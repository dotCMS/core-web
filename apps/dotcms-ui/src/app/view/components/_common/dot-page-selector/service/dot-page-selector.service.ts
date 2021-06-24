import { map, pluck, flatMap, toArray, switchMap, take, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Site, CoreWebService } from '@dotcms/dotcms-js';
import {
    DotFolder,
    DotPageSelectorItem,
    DotPageSelectorResults,
    DotSimpleURL
} from '../models/dot-page-selector.models';

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
    hostName: string;
    lastReview: string;
    stInode: string;
    url?: string;
}

const HOST_FULL_REGEX = /^\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b\//;
const PAGE_BASE_TYPE_QUERY = '+basetype:5';
const MAX_RESULTS_SIZE = 20;

@Injectable()
export class DotPageSelectorService {
    // private currentHost: Site;
    // private isFolderSearch: boolean;

    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get page asset by identifier
     *
     * @param {string} identifier
     * @returns {Observable<DotPageSelectorItem>}
     * @memberof DotPageSelectorService
     */
    getPageById(identifier: string): Observable<DotPageSelectorItem> {
        return this.coreWebService
            .requestView({
                body: this.getRequestBodyQuery(
                    `${PAGE_BASE_TYPE_QUERY} +identifier:*${identifier}*`
                ),
                method: 'POST',
                url: '/api/es/search'
            })
            .pipe(
                pluck('contentlets'),
                flatMap((pages: DotPageAsset[]) => pages),
                map((page: DotPageAsset) => {
                    return {
                        label: `//${page.hostName}${page.path}`,
                        payload: page
                    };
                })
            );
    }
    //
    // /**
    //  * Set the host to perform page searches
    //  *
    //  * @param {Site} host
    //  * @memberof DotPageSelectorService
    //  */
    // setCurrentHost(host: Site): void {
    //     this.currentHost = host;
    // }
    //
    // /**
    //  * Set if the search is for folders
    //  *
    //  * @param {boolean} isFolderSearch
    //  * @memberof DotPageSelectorService
    //  */
    // setFolderSearch(isFolderSearch: boolean): void {
    //     this.isFolderSearch = isFolderSearch;
    // }

    // /**
    //  * Search for host, page or both
    //  *
    //  * @param {string} param
    //  * @returns {Observable<DotPageSelectorResults>}
    //  * @memberof DotPageSelectorService
    //  */
    // search(param: string): Observable<DotPageSelectorResults> {
    //     debugger;
    //     if (this.isTwoStepSearch(param)) {
    //         return this.fullSearch(param);
    //     } else {
    //         return this.conditionalSearch(param);
    //     }
    // }

    // private conditionalSearch(param: string): Observable<DotPageSelectorResults> {
    //     debugger;
    //     return this.shouldSearchPages(param)
    //         ? this.isFolderSearch
    //             ? this.getFolders(param)
    //             : this.getPages(param)
    //         : this.getSites(this.getSiteName(param));
    // }
    //
    // private fullSearch(param: string): Observable<DotPageSelectorResults> {
    //     const host = this.parseUrl(param).host;
    //     return this.getSites(host, true).pipe(
    //         take(1),
    //         switchMap((results: DotPageSelectorResults) => {
    //             if (results.data.length) {
    //                 this.setCurrentHost(<Site>results.data[0].payload);
    //                 return this.isFolderSearch ? this.getFolders(param) : this.getPages(param);
    //             } else {
    //                 return of(results);
    //             }
    //         })
    //     );
    // }

    getPages(path: string): Observable<DotPageSelectorItem[]> {
        return this.coreWebService
            .requestView({
                url: `v1/page/search?path=${path}&onlyLiveSites=true&live=false`
            })
            .pipe(
                pluck('entity'),
                map((pages: DotPageAsset[]) => {
                    return pages.map((page) => {
                        return {
                            label: `//${page.hostName}${page.path}`,
                            payload: page
                        };
                    });
                })
            );
    }

    getFolders(path: string): Observable<DotPageSelectorItem[]> {
        return this.coreWebService
            .requestView({
                url: `/api/v1/folder/byPath`,
                body: { path: path },
                method: 'POST'
            })
            .pipe(
                pluck('entity'),
                map((folder: DotFolder[]) => {
                    return folder.map((folder: DotFolder) => {
                        return {
                            label: `//${folder.hostname}${folder.path}`,
                            payload: folder
                        };
                    });
                })
            );
    }

    private getRequestBodyQuery(query: string, size?: number): { [key: string]: {} } {
        let obj = {
            query: {
                query_string: {
                    query: query
                }
            }
        };
        if (size) {
            obj = Object.assign(obj, { size: size });
        }
        return obj;
    }

    getSites(param: string, specific?: boolean): Observable<DotPageSelectorItem[]> {
        let query = '+contenttype:Host -identifier:SYSTEM_HOST +host.hostName:';
        query += specific ? this.getSiteName(param) : `*${this.getSiteName(param)}*`;
        return this.coreWebService
            .requestView({
                body: param
                    ? this.getRequestBodyQuery(query)
                    : this.getRequestBodyQuery(query, MAX_RESULTS_SIZE),
                method: 'POST',
                url: '/api/es/search'
            })
            .pipe(
                pluck('contentlets'),
                map((sites: Site[]) => {
                    return sites.map((site) => {
                        return { payload: site, label: `//${site.hostname}/` };
                    });
                })

                //
                // flatMap((sites: Site[]) => sites),
                // map((site: Site) => {
                //     return {
                //         label: `//${site.hostname}/`,
                //         payload: site,
                //         isHost: true
                //     };
                // })
            );
    }

    private getSiteName(site: string): string {
        return site.replace(/\//g, '');
    }

    // private isHostAndPath(param: string): boolean {
    //     const url: DotSimpleURL | { [key: string]: string } = this.parseUrl(param);
    //     return url && !!(url.host && url.pathname.length > 0);
    // }
    //
    // private isReSearchingForHost(query: string): boolean {
    //     return this.isSearchingForHost(query) && this.hostChanged(query);
    // }

    // private hostChanged(query: string): boolean {
    //     const parsedURL = this.parseUrl(query);
    //     return (
    //         this.currentHost &&
    //         parsedURL &&
    //         this.currentHost.hostname.toLocaleLowerCase() !== parsedURL.host.toLocaleLowerCase()
    //     );
    // }

    // private isSearchingForHost(query: string): boolean {
    //     return query.startsWith('//');
    // }

    // private isTwoStepSearch(param): boolean {
    //     return this.isHostAndPath(param) && (!this.currentHost || this.hostChanged(param));
    // }

    // private parseUrl(query: string): DotSimpleURL {
    //     if (this.isSearchingForHost(query)) {
    //         try {
    //             const url = new URL(`http:${query}`);
    //             return { host: url.host, pathname: url.pathname.substr(1) };
    //         } catch {
    //             return null;
    //         }
    //     } else {
    //         return null;
    //     }
    // }

    // private shouldSearchPages(query: string): boolean {
    //     debugger;
    //     if (!this.isHostAndPath(query) || this.isReSearchingForHost(query)) {
    //         this.currentHost = null;
    //     }
    //
    //     return !!(this.currentHost || !this.isSearchingForHost(query));
    // }
}
