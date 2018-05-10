import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ResponseView, HttpCode } from 'dotcms-js/dotcms-js';

import { DotRouterService } from '../../../../../api/services/dot-router/dot-router.service';
import { DotRenderedPageState } from '../../../shared/models/dot-rendered-page-state.model';
import { DotPageStateService } from '../../../content/services/dot-page-state/dot-page-state.service';
import { DotHttpErrorManagerService } from '../../../../../api/services/dot-http-error-manager/dot-http-error-manager.service';
import { DotEditPageDataService } from './dot-edit-page-data.service';
import { take, switchMap } from 'rxjs/operators';

/**
 * With the url return a string of the edit page html
 *
 * @export
 * @class EditContentResolver
 * @implements {Resolve<DotRenderedPageState>}
 */
@Injectable()
export class DotEditPageResolver implements Resolve<DotRenderedPageState> {
    constructor(
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotPageStateService: DotPageStateService,
        private dotRouterService: DotRouterService,
        private dotEditPageDataService: DotEditPageDataService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DotRenderedPageState> {
        const data = this.dotEditPageDataService.getAndClean();
        if (data) {
            return Observable.of(data);
        } else {
            return this.dotPageStateService
                .get(route.queryParams.url)
                .pipe(
                    take(1)
                ).do((dotRenderedPageState: DotRenderedPageState) => {
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
            throw new ResponseView(new Response({
                body: {},
                status: HttpCode.FORBIDDEN,
                headers: null,
                url: '',
                merge: null
            }));
        } else if (!dotRenderedPageState.layout) {
            throw new ResponseView(new Response({
                body: {},
                status: HttpCode.FORBIDDEN,
                headers: new Headers({
                    'error-key': 'dotcms.api.error.license.required'
                }),
                url: '',
                merge: null
            }));
        }
    }

    private errorHandler(err: ResponseView): Observable<DotRenderedPageState> {
        return this.dotHttpErrorManagerService.handle(err).pipe(
                switchMap((res: DotHttpErrorHandled) => {

                if (!res.redirected) {
                    this.dotRouterService.gotoPortlet('/c/site-browser');
                }

                return Observable.of(null);
            }
        ));
    }
}
