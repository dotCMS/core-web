import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { PageView } from '../../../portlets/dot-edit-page/shared/models/page-view.model';

/**
 * Provide util methods to get and save a PageView object
 * @export
 * @class PageViewService
 */
@Injectable()
export class PageViewService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get object response by url endpoint
     * @param {string} url
     * @returns {Observable<PageView>}
     * @memberof PageViewService
     */
    get(url: string): Observable<PageView> {
        return this.coreWebService.requestView({
            method: RequestMethod.Get,
            url: `v1/page/render/${url}?live=false`
        }).pluck('bodyJsonObject');
    }

    /**
     * Will do a POST request and return the response of the URL provided
     * @param {PageView} pageView
     * @returns {Observable<any>}
     * @memberof PageViewService
     */
    save(pageView: PageView): Observable<any> {
        return this.coreWebService.requestView({
            body: {
                layout: pageView.layout
            },
            method: RequestMethod.Post,
            url: `v1/page/${pageView.page.identifier}/layout`
        }).pluck('entity');
    }
}
