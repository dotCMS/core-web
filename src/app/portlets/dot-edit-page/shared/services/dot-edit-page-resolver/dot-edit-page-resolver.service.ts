import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Response, Headers } from '@angular/http';

import { ResponseView, HttpCode } from 'dotcms-js';
import { take, switchMap } from 'rxjs/operators';

import { DotPageRenderState } from '../../models/dot-rendered-page-state.model';
import { DotPageStateService } from '../../../content/services/dot-page-state/dot-page-state.service';
import { DotPageRenderOptions } from '@services/dot-page-render/dot-page-render.service';

/**
 * With the url return a string of the edit page html
 *
 * @export
 * @class EditContentResolver
 * @implements {Resolve<DotRenderedPageState>}
 */
@Injectable()
export class DotEditPageResolver implements Resolve<DotPageRenderState> {
    constructor(private dotPageStateService: DotPageStateService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DotPageRenderState> {
        const data = this.dotPageStateService.getInternalNavigationState();

        if (data) {
            return of(data);
        } else {
            const state$ = this.dotPageStateService.state$.pipe(
                take(1),
                switchMap((dotRenderedPageState: DotPageRenderState) => {
                    const currentSection = route.children[0].url[0].path;
                    const isLayout = currentSection === 'layout';

                    return isLayout
                        ? this.checkUserCanGoToLayout(dotRenderedPageState)
                        : of(dotRenderedPageState);
                })
            );

            const options: DotPageRenderOptions = {
                url: route.queryParams.url,
                ...(route.queryParams.language_id
                    ? {
                          viewAs: {
                              language: route.queryParams.language_id
                          }
                      }
                    : {})
            };

            this.dotPageStateService.get(options);

            return state$;
        }
    }

    private checkUserCanGoToLayout(
        dotRenderedPageState: DotPageRenderState
    ): Observable<DotPageRenderState> {
        if (!dotRenderedPageState.page.canEdit) {
            return observableThrowError(
                new ResponseView(
                    new Response({
                        body: {},
                        status: HttpCode.FORBIDDEN,
                        headers: null,
                        url: '',
                        merge: null
                    })
                )
            );
        } else if (!dotRenderedPageState.layout) {
            return observableThrowError(
                new ResponseView(
                    new Response({
                        body: {},
                        status: HttpCode.FORBIDDEN,
                        headers: new Headers({
                            'error-key': 'dotcms.api.error.license.required'
                        }),
                        url: '',
                        merge: null
                    })
                )
            );
        } else {
            return of(dotRenderedPageState);
        }
    }
}
