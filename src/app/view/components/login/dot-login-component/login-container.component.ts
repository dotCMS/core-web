import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpRequestUtils, LoginService, LoggerService, HttpCode, User } from 'dotcms-js';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotLoadingIndicatorService } from '../../_common/iframe/dot-loading-indicator/dot-loading-indicator.service';
import { DotLoginCredentials } from '@models/dot-login/dot-login-credentials.model';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [HttpRequestUtils],
    selector: 'dot-login-container',
    template: `
        <dot-login-component
            [message]="message"
            [isLoginInProgress]="isLoginInProgress"
            (login)="logInUser($event)"
            [passwordChanged]="passwordChanged"
            [resetEmailSent]="resetEmailSent"
            [resetEmail]="resetEmail"
        >
        </dot-login-component>
    `
})
export class LoginContainerComponent implements OnInit {
    public isLoginInProgress = false;
    public message: string;
    public passwordChanged = false;
    public resetEmail = '';
    public resetEmailSent = false;

    constructor(
        private dotRouterService: DotRouterService,
        private loginService: LoginService,
        private dotLoadingIndicatorService: DotLoadingIndicatorService,
        private loggerService: LoggerService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.activatedRoute.queryParams.pipe(take(1)).subscribe((params: Params) => {
            if (params['changedPassword']) {
                this.passwordChanged = params['changedPassword'];
            } else if (params['resetEmailSent']) {
                this.resetEmailSent = params['resetEmailSent'];
                this.resetEmail = decodeURIComponent(params['resetEmail']);
            }
        });
    }

    logInUser(loginCredentials: DotLoginCredentials): void {
        this.isLoginInProgress = true;
        this.dotLoadingIndicatorService.show();
        this.message = '';

        this.loginService
            .loginUser(
                loginCredentials.login,
                loginCredentials.password,
                loginCredentials.rememberMe,
                loginCredentials.language
            )
            .pipe(take(1))
            .subscribe(
                (user: User) => {
                    this.message = '';
                    this.dotLoadingIndicatorService.hide();
                    this.dotRouterService.goToMain(user['editModeUrl']);
                },
                (error: any) => {
                    if (this.isBadRequestOrUnathorized(error.status)) {
                        this.message = error.bodyJsonObject.errors[0].message;
                    } else {
                        this.loggerService.debug(error);
                    }
                    this.isLoginInProgress = false;
                    this.dotLoadingIndicatorService.hide();
                }
            );
    }

    private isBadRequestOrUnathorized(status: number) {
        return status === HttpCode.BAD_REQUEST || status === HttpCode.UNAUTHORIZED;
    }
}
