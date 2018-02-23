import { DotMessageService } from './../dot-messages-service';
import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ResponseView, CoreWebService, LoginService, HttpCode } from 'dotcms-js/dotcms-js';

import { DotDialogService } from '../dot-dialog';
import { DotRouterService } from '../dot-router/dot-router.service';


/**
 * Handle the UI and redirects when a HTTP errors happens
 *
 * @export
 * @class DotInterceptor
 */
@Injectable()
export class DotInterceptor {
    constructor(
        private coreWebService: CoreWebService,
        private dotDialogService: DotDialogService,
        private dotMessageService: DotMessageService,
        private dotRouterService: DotRouterService,
        private loginService: LoginService
    ) {
        this.dotMessageService.getMessages([
            'dot.common.http.error.403.header',
            'dot.common.http.error.403.message',
            'dot.common.http.error.500.header',
            'dot.common.http.error.500.message'
        ]).subscribe();
    }

    /**
     * Do request and handle http errors in the UI
     * 403: show dialog with error message and redirect to main component
     * 401: redirect to login page
     * 500: show dialog with error message
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

    private callErrorHandler(code: HttpCode): void {
        const errors = {};

        errors[HttpCode.UNAUTHORIZED] = () => {
            this.handleUnathorized();
        };

        errors[HttpCode.FORBIDDEN] = () => {
            this.handleForbidden();
        };

        errors[HttpCode.SERVER_ERROR] = () => {
            this.handleServerError();
        };

        errors[code]();
    }

    private handleUnathorized(): void {
        if (this.loginService.auth.user) {
            this.handleForbidden();
        } else {
            this.dotRouterService.goToLogin();
        }
    }

    private handleForbidden(): void {
        this.dotRouterService.goToMain();

        this.dotDialogService.alert({
            message: this.dotMessageService.get('dot.common.http.error.403.message'),
            header: this.dotMessageService.get('dot.common.http.error.403.header')
        });
    }

    private handleServerError(): void {
        this.dotDialogService.alert({
            message: this.dotMessageService.get('dot.common.http.error.500.message'),
            header: this.dotMessageService.get('dot.common.http.error.500.header')
        });
    }
}
