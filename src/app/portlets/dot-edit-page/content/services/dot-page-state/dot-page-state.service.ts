import { of as observableOf, Observable, Subject } from 'rxjs';

import { mergeMap, pluck, take, map } from 'rxjs/operators';
import { DotPage } from './../../../shared/models/dot-page.model';
import { LoginService, User } from 'dotcms-js';
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

@Injectable()
export class DotPageStateService {
    state$: Subject<DotRenderedPageState> = new Subject<DotRenderedPageState>();
    private currentState: DotRenderedPageState;

    constructor(
        private dotPageRenderService: DotPageRenderService,
        private dotContentletLockerService: DotContentletLockerService,
        private loginService: LoginService
    ) {}

    set(page: DotPage, state: DotPageState): void {
        console.log('set', state);
        const lockUnlock$: Observable<string> = this.getLockMode(page.workingInode, state.locked);

        const pageOpts: DotPageRenderOptions = {
            url: page.pageURI,
            mode: state.mode
        };

        const pageMode$: Observable<DotPageRender> =
            state.mode !== undefined ? this.requestPage(pageOpts) : observableOf(null);

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
                )
            )
            .subscribe((dotRenderedPageState: DotRenderedPageState) => {
                this.setState(dotRenderedPageState);
            });
    }

    get(options: DotPageRenderOptions = {}): void {
        if (!options.url) {
            options.url = this.currentState.page.pageURI;
        }

        this.requestPage(options).subscribe((pageState: DotRenderedPageState) => {
            this.setState(pageState);
        });
    }

    reload(): void {
        this.get();
    }

    requestPage(options: DotPageRenderOptions): Observable<DotRenderedPageState> {
        return this.dotPageRenderService.get(options).pipe(
            take(1),
            // tslint:disable-next-line: cyclomatic-complexity
            map((page: DotPageRender) => {
                const pageState = new DotRenderedPageState(this.getCurrentUser(), page);
                this.currentState = pageState;
                return pageState;
            })
        );
    }

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
        if (!persona.personalized && this.currentState.page.locked) {
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

    setLanguage(language: number): void {
        this.get({
            viewAs: {
                language
            }
        });
    }

    private getCurrentUser(): User {
        return this.loginService.auth.loginAsUser || this.loginService.auth.user;
    }

    private setState(state: DotRenderedPageState): void {
        this.state$.next(state);
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
