import { of, Observable, Subject } from 'rxjs';

import { mergeMap, pluck, take, map, catchError } from 'rxjs/operators';
import { LoginService, User, ResponseView } from 'dotcms-js';
import {
    DotPageState,
    DotRenderedPageState
} from '../../../shared/models/dot-rendered-page-state.model';
import {
    DotPageRenderService,
    DotPageRenderOptions
} from '@services/dot-page-render/dot-page-render.service';
import { DotPageRender } from '../../../shared/models/dot-rendered-page.model';
import { Injectable } from '@angular/core';
import { DotContentletLockerService } from '@services/dot-contentlet-locker/dot-contentlet-locker.service';
import { DotPersona } from '@shared/models/dot-persona/dot-persona.model';
import { PageMode } from '@portlets/dot-edit-page/shared/models/page-mode.enum';
import { DotDevice } from '@shared/models/dot-device/dot-device.model';
import {
    DotHttpErrorManagerService,
    DotHttpErrorHandled
} from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Injectable()
export class DotPageStateService {
    state$: Subject<DotRenderedPageState> = new Subject<DotRenderedPageState>();
    private currentState: DotRenderedPageState;

    constructor(
        private dotContentletLockerService: DotContentletLockerService,
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotPageRenderService: DotPageRenderService,
        private dotRouterService: DotRouterService,
        private loginService: LoginService
    ) {}

    /**
     * Get the page state with the options passed
     *
     * @param {DotPageRenderOptions} [options={}]
     * @memberof DotPageStateService
     */
    get(options: DotPageRenderOptions = {}): void {
        if (!options.url) {
            options.url = this.currentState.page.pageURI;
        }

        this.requestPage(options).subscribe((pageState: DotRenderedPageState) => {
            this.setState(pageState);
        });
    }

    /**
     * Set a new page state bet first lock/unlock according to the state received
     *
     * @param {DotPage} { workingInode, pageURI }
     * @param {DotPageState} state
     * @memberof DotPageStateService
     */
    set(state: DotPageState): void {
        const lockUnlock$: Observable<string> = this.getLockMode(
            this.currentState.page.inode,
            state.locked
        );

        const pageOpts: DotPageRenderOptions = {
            url: this.currentState.page.pageURI,
            mode: state.mode
        };

        const pageMode$: Observable<DotPageRender> =
            state.mode !== undefined ? this.requestPage(pageOpts) : of(null);

        lockUnlock$
            .pipe(
                mergeMap(() =>
                    pageMode$.pipe(
                        map(
                            (updatedPage: DotPageRender) =>
                                new DotRenderedPageState(
                                    this.loginService.auth.loginAsUser ||
                                        this.loginService.auth.user,
                                    updatedPage
                                )
                        )
                    )
                ),
                take(1)
            )
            .subscribe((dotRenderedPageState: DotRenderedPageState) => {
                this.setState(dotRenderedPageState);
            });
    }

    /**
     * Reload the current page state
     *
     * @memberof DotPageStateService
     */
    reload(): void {
        this.get();
    }

    /**
     * Request an new page state and set the local internal state
     *
     * @param {DotPageRenderOptions} options
     * @returns {Observable<DotRenderedPageState>}
     * @memberof DotPageStateService
     */
    requestPage(options: DotPageRenderOptions): Observable<DotRenderedPageState> {
        return this.dotPageRenderService.get(options).pipe(
            catchError((err: ResponseView) => {
                this.handleSetPageStateFailed(err);
                return of(null);
            }),
            take(1),
            map((page: DotPageRender) => {
                if (page) {
                    const pageState = new DotRenderedPageState(this.getCurrentUser(), page);
                    this.currentState = pageState;
                    return pageState;
                }

                return this.currentState;
            })
        );
    }

    /**
     * Set the page state of view as to received persona and update the mode and lock state if
     * persona is not personalized.
     *
     * @param {DotPersona} persona
     * @memberof DotPageStateService
     */
    setPersona(persona: DotPersona): void {
        const options: DotPageRenderOptions = {
            mode: this.currentState.viewAs.mode,
            viewAs: {
                persona
            }
        };

        // All this logic to unlock the page and set a mode is because per UX we can't allow
        // a non personalized page to show in EDIT MODE and locked, in other hand maybe we
        // need to move this to the backend.
        if (this.shouldLockPageToSetPersona(persona)) {
            options.mode = PageMode.PREVIEW;

            this.dotContentletLockerService
                .unlock(this.currentState.page.inode)
                .pipe(
                    take(1),
                    pluck('message')
                )
                .subscribe(() => this.get(options));
        } else {
            this.get(options);
        }
    }

    /**
     * Set the page state of view as to received language
     *
     * @param {number} language
     * @memberof DotPageStateService
     */
    setLanguage(language: number): void {
        this.get({
            viewAs: {
                language
            }
        });
    }

    /**
     * Set the page state of view as to received device
     *
     * @param {DotDevice} device
     * @memberof DotPageStateService
     */
    setDevice(device: DotDevice): void {
        this.get({
            viewAs: {
                device
            }
        });
    }

    private getCurrentUser(): User {
        return this.loginService.auth.loginAsUser || this.loginService.auth.user;
    }

    private getLockMode(workingInode: string, lock: boolean): Observable<string> {
        if (lock === true) {
            return this.dotContentletLockerService.lock(workingInode).pipe(pluck('message'));
        } else if (lock === false) {
            return this.dotContentletLockerService.unlock(workingInode).pipe(pluck('message'));
        }

        return of(null);
    }

    private handleSetPageStateFailed(err: ResponseView): void {
        this.dotHttpErrorManagerService
            .handle(err)
            .pipe(take(1))
            .subscribe((res: DotHttpErrorHandled) => {
                if (res.forbidden) {
                    this.dotRouterService.goToSiteBrowser();
                } else {
                    this.reload();
                }
            });
    }

    private setState(state: DotRenderedPageState): void {
        this.state$.next(state);
    }

    private shouldLockPageToSetPersona(persona: DotPersona): boolean {
        return (
            !persona.personalized &&
            this.currentState.page.locked &&
            this.currentState.viewAs.mode === PageMode.EDIT
        );
    }
}
