import { of as observableOf, Observable, Subject } from 'rxjs';

import { mergeMap, pluck, take, map } from 'rxjs/operators';
import { DotPage } from './../../../shared/models/dot-page.model';
import { LoginService, User } from 'dotcms-js';
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
    private currentState: DotRenderedPageState;

    constructor(
        private dotRenderHTMLService: DotRenderHTMLService,
        private dotContentletLockerService: DotContentletLockerService,
        private loginService: LoginService
    ) {}

    set(page: DotPage, state: DotPageState): void {
        const lockUnlock$: Observable<string> = this.getLockMode(page.workingInode, state.locked);

        const pageOpts: DotRenderPageOptions = {
            url: page.pageURI,
            mode: state.mode
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
                this.setState(dotRenderedPageState);
            });
    }

    get(options: DotRenderPageOptions): void {
        this.requestPage(options).subscribe((pageState: DotRenderedPageState) => {
            this.setState(pageState);
        });
    }

    reload(): void {
        this.get({
            url: this.currentState.page.pageURI
        });
    }

    requestPage(options: DotRenderPageOptions): Observable<DotRenderedPageState> {
        return this.dotRenderHTMLService.get(options).pipe(
            take(1),
            // tslint:disable-next-line: cyclomatic-complexity
            map((page: DotRenderedPage) => {
                const pageState = new DotRenderedPageState(this.getCurrentUser(), page);

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

    private getCurrentUser(): User {
        return this.loginService.auth.loginAsUser || this.loginService.auth.user;
    }

    private setState(state: DotRenderedPageState): void {
        this.state$.next(state);
        this.currentState = state;
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
