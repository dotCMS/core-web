import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { pluck } from 'rxjs/operators';

export interface DotCMSPersonalizedItem {
    relationType: string;
    treeOrder: number;
    personalization: string;
    container: string;
    contentlet: string;
    htmlPage: string;
}

@Injectable()
export class DotPersonalizeService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Set a personalized page for the persona passed
     *
     * @param {string} pageId
     * @param {string} personaTag
     * @returns {Observable<DotCMSPersonalizedItem[]>}
     * @memberof DotPersonalizeService
     */
    personalized(pageId: string, personaTag: string): Observable<DotCMSPersonalizedItem[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Post,
                url: `/api/v1/personalization/pagepersonas`,
                body: {
                    pageId,
                    personaTag
                }
            })
            .pipe(pluck('entity'));
    }

    /**
     * Remove the personalization of the page for the persona passed
     *
     * @param {string} pageId
     * @param {string} personaTag
     * @returns {Observable<string>}
     * @memberof DotPersonalizeService
     */
    despersonalized(pageId: string, personaTag: string): Observable<string> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `/api/v1/personalization/pagepersonas/page/${pageId}/personalization/${personaTag}`
            })
            .pipe(pluck('entity'));
    }
}
