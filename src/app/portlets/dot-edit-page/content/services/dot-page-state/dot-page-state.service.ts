import { of as observableOf, Observable, Subject } from 'rxjs';

import { mergeMap, pluck, take, map } from 'rxjs/operators';
import { DotPage } from './../../../shared/models/dot-page.model';
import { LoginService } from 'dotcms-js';
import {
    DotPageState,
    DotRenderedPageState
} from '../../../shared/models/dot-rendered-page-state.model';
import {
    DotRenderHTMLService,
    DotRenderPageOptions
} from '@services/dot-render-html/dot-render-html.service';
import { DotRenderedPage } from '../../../shared/models/dot-rendered-page.model';
import { Injectable } from '@angular/core';
import { DotContentletLockerService } from '@services/dot-contentlet-locker/dot-contentlet-locker.service';
import { PageMode } from '@portlets/dot-edit-page/shared/models/page-mode.enum';

@Injectable()
export class DotPageStateService {
    state$: Subject<DotRenderedPageState> = new Subject<DotRenderedPageState>();

    constructor(
        private dotRenderHTMLService: DotRenderHTMLService,
        private dotContentletLockerService: DotContentletLockerService,
        private loginService: LoginService
    ) {}

    /**
     * Set the page state
     *
     * @param {DotPage} page
     * @param {DotPageState} state
     * @memberof DotPageStateService
     */
    set(page: DotPage, state: DotPageState): void {
        const lockUnlock$: Observable<string> = this.getLockMode(page.workingInode, state.locked);

        const pageOpts: DotRenderPageOptions = {
            url: page.pageURI,
            mode: state.mode,
        };

        const pageMode$: Observable<DotRenderedPage> =
            state.mode !== undefined ? this.dotRenderHTMLService.get(pageOpts) : observableOf(null);

        lockUnlock$
            .pipe(
                mergeMap(() =>
                    pageMode$.pipe(
                        map(
                            (updatedPage: DotRenderedPage) =>
                                new DotRenderedPageState(
                                    this.loginService.auth.loginAsUser ||
                                        this.loginService.auth.user,
                                    updatedPage
                                )
                        )
                    )
                )
            )
            .subscribe((dotRenderedPageState: DotRenderedPageState) => {
                this.state$.next(dotRenderedPageState);
            });
    }

    /**
     * Get page state
     *
     * @param string url
     * @param number [languageId]
     * @returns Observable<DotRenderedPageState>
     * @memberof DotPageStateService
     */
    get(options: DotRenderPageOptions | string): void {
        if (typeof options === 'string') {
            options = {
                url: options
            };
        }

        this.requestPage(options).subscribe((pageState: DotRenderedPageState) => {
            this.state$.next(pageState);
        });
    }

    requestPage(options: DotRenderPageOptions): Observable<DotRenderedPageState> {
        return this.dotRenderHTMLService.get(options).pipe(
            take(1),
            // tslint:disable-next-line: cyclomatic-complexity
            map((page: DotRenderedPage) => {
                const pageState = new DotRenderedPageState(
                    this.loginService.auth.loginAsUser || this.loginService.auth.user,
                    page
                );

                if (
                    pageState.viewAs.persona &&
                    !pageState.viewAs.persona.personalized &&
                    pageState.viewAs.mode === PageMode.EDIT
                ) {
                    pageState.state.mode = PageMode.PREVIEW;
                    pageState.state.locked = false;
                }

                return pageState;
            })
        );
    }

    private getLockMode(workingInode: string, lock: boolean): Observable<string> {
        if (lock === true) {
            return this.dotContentletLockerService.lock(workingInode).pipe(pluck('message'));
        } else if (lock === false) {
            return this.dotContentletLockerService.unlock(workingInode).pipe(pluck('message'));
        }

        return observableOf(null);
    }
}
