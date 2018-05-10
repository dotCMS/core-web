import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ResponseView, HttpCode } from 'dotcms-js/dotcms-js';

import { DotRouterService } from '../../../../../api/services/dot-router/dot-router.service';
import { DotRenderedPageState } from '../../../shared/models/dot-rendered-page-state.model';
import { DotPageStateService } from '../../../content/services/dot-page-state/dot-page-state.service';
import { DotHttpErrorManagerService, DotHttpErrorHandled } from '../../../../../api/services/dot-http-error-manager/dot-http-error-manager.service';
import { DotEditPageDataService } from './dot-edit-page-data.service';

/**
 * With the url return a string of the edit page html
 *
 * @export
 * @class EditContentResolver
 * @implements {Resolve<DotRenderedPageState>}
 */
@Injectable()
export class DotEditPageResolver implements Resolve<DotRenderedPageState | DotHttpErrorHandled> {
    constructor(
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotPageStateService: DotPageStateService,
        private dotRouterService: DotRouterService,
        private dotEditPageDataService: DotEditPageDataService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DotRenderedPageState | DotHttpErrorHandled> {
        const data = this.dotEditPageDataService.getAndClean();
        if (data) {
            return Observable.of(data);
        } else {
            return this.dotPageStateService
                .get(route.queryParams.url)
                .take(1)
                .do((dotRenderedPageState: DotRenderedPageState) => {
                    const currentSection = route.children[0].url[0].path;
                    const isLayout = currentSection === 'layout';

                    if (isLayout) {
                        this.checkUserCanGoToLayout(dotRenderedPageState);
                    }
                })
                .catch((err: ResponseView) => {
                    return this.errorHandler(err);
                });
        }
    }

    private checkUserCanGoToLayout (dotRenderedPageState: DotRenderedPageState): void {
        if (!dotRenderedPageState.page.canEdit) {
            throw this.dotHttpErrorManagerService.fakeForbiddenError;
        } else if (!dotRenderedPageState.layout) {
            throw this.dotHttpErrorManagerService.fakeLicenseError;
        }
    }

    private errorHandler(err: ResponseView): Observable<DotHttpErrorHandled> {
        return this.dotHttpErrorManagerService.handle(err).do((res: DotHttpErrorHandled) => {

            if (!res.redirected) {
                this.dotRouterService.gotoPortlet('/c/site-browser');
            }
        });
    }
}
