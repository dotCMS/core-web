import { RequestMethod } from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';

import { CoreWebService } from 'dotcms-js';
import { DotLayout, DotPageRender, DotPageRenderResponse } from '@portlets/dot-edit-page/shared/models';


/**
 * Provide util methods interact with layout API
 *
 * @export
 * @class DotPageLayoutService
 */
@Injectable()
export class DotPageLayoutService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Save the layout of a page
     *
     * @param {string} pageIdentifier
     * @param {DotLayout} dotLayout
     * @returns {Observable<DotPageRender>}
     * @memberof DotPageLayoutService
     */
    save(pageIdentifier: string, dotLayout: DotLayout): Observable<DotPageRender> {
        return this.coreWebService
            .requestView({
                body: dotLayout,
                method: RequestMethod.Post,
                url: `v1/page/${pageIdentifier}/layout`
            })
            .pipe(
                pluck('entity'),
                map((dotPageRenderResponse: DotPageRenderResponse) => new DotPageRender(dotPageRenderResponse))
            );
    }
}
