import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

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
    get(url: string): Observable<any> {
        return this.coreWebService.requestView({
            method: RequestMethod.Get,
            url: `v1/page/render/${url}`
        });
    }
}
