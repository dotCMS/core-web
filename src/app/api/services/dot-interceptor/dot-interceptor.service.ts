import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ResponseView, CoreWebService } from 'dotcms-js/dotcms-js';

import { DotConfirmationService } from '../dot-confirmation';
import { DotRouterService } from '../dot-router-service';

@Injectable()
export class DotInterceptor {
    constructor(
        private coreWebService: CoreWebService,
        private dotRouterService: DotRouterService,
        private dotConfirmationService: DotConfirmationService
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
                this.handle401();
            }
        };

        errors[code]();
    }

    private handle401(): void {
        this.dotRouterService.goToLogin();
    }

    private handle403(): void {
        this.dotConfirmationService.alert({
            message: 'You don\'t access to this page',
            header: 'Can go there',
            footerLabel: {
                acceptLabel: 'Ok'
            }
        });
    }

    private handle500(): void {
        this.dotConfirmationService.alert({
            message: 'Please try again later',
            header: 'Unkown error',
            footerLabel: {
                acceptLabel: 'Ok'
            }
        });
    }
}
