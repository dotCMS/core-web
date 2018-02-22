import { DotMessageService } from './../dot-messages-service';
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
        this.dotRouterService.goToMain();

        this.dotDialogService.alert({
            message: this.dotMessageService.get('dot.common.http.error.403.message'),
            header: this.dotMessageService.get('dot.common.http.error.403.header')
        });
    }

    private handle500(): void {
        this.dotDialogService.alert({
            message: this.dotMessageService.get('dot.common.http.error.500.message'),
            header: this.dotMessageService.get('dot.common.http.error.500.header')
        });
    }
}
