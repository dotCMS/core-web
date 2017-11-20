import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { PageView } from '../../../portlets/dot-edit-page/shared/models/page-view.model';

/**
 * Provide util pageView methods
 * @export
 * @class PageViewService
 */
@Injectable()
export class PageViewService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get object response by url endpoint
     * @param {string} url
     * @returns {Observable<any>}
     * @memberof PageViewService
     */
    get(url: string): Observable<PageView> {
        return this.coreWebService.requestView({
            method: RequestMethod.Get,
            url: `v1/page/render/${url}`
        }).pluck('bodyJsonObject');
    }
}
