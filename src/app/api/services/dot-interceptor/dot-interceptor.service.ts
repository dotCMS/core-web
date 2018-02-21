import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ResponseView, CoreWebService, LoginService } from 'dotcms-js/dotcms-js';

import { DotDialogService } from '../dot-dialog';
import { DotRouterService } from '../dot-router-service';

@Injectable()
export class DotInterceptor {
    constructor(
        private coreWebService: CoreWebService,
        private dotRouterService: DotRouterService,
        private dotDialogService: DotDialogService,
        private loginService: LoginService
    ) {}

    /**
     * Do request, show errors in the ui and do redirects
     *
     * @param {RequestOptionsArgs} options
     * @returns {Observable<ResponseView>}
     * @memberof DotInterceptor
     */
    request(options: RequestOptionsArgs): Observable<ResponseView> {
        return this.coreWebService
            .requestView(options)
            .catch((err: ResponseView) => this.handleErrors(err))
            .filter((res: ResponseView) => res !== null);
    }

    private handleErrors(err: ResponseView): Observable<ResponseView> {
        this.callErrorHandler(err.response.status);
        return Observable.of(null);
    }

    private callErrorHandler(code: number): void {
        const errors = {
            401: () => {
                this.handle401();
            },
            403: () => {
                this.handle403();
            },
            500: () => {
                this.handle500();
            }
        };

        errors[code]();
    }

    private handle401(): void {
        if (this.loginService.auth.user) {
            this.handle403();
        } else {
            this.dotRouterService.goToLogin();
        }
    }

    private handle403(): void {
        this.dotRouterService.gotoPortlet('c/workflow');
        this.dotDialogService.alert({
            message: 'You don\'t access to this page',
            header: 'Can\'t go there',
            footerLabel: {
                accept: 'Ok'
            }
        });
    }

    private handle500(): void {
        this.dotDialogService.alert({
            message: 'Please try again later',
            header: 'Unkown error',
            footerLabel: {
                accept: 'Ok'
            }
        });
    }
}
