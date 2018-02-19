import { Router, ActivatedRoute } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js/dotcms-js';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [LoginService],
    selector: 'dot-reset-password-container',
    styleUrls: [],
    template: `
        <dot-reset-password-component
            [token]="token"
            [message]="message"
            (changePassword)="changePassword($event)">
        </dot-reset-password-component>
    `
})
export class ResetPasswordContainerComponent {
    public message = '';
    public token = '';

    private changePasswordSuccessfully: string;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private route: ActivatedRoute,
        private loggerService: LoggerService
    ) {
        this.route.params.pluck('token').subscribe((token) => {
            this.token = <string>token;
        });

        this.loginService.getLoginFormInfo('', ['message.forgot.password.password.updated']).subscribe(
            (data) => {
                const dataI18n = data.i18nMessagesMap;
                this.changePasswordSuccessfully = dataI18n['message.forgot.password.password.updated'];
            },
            (error) => {
                this.loggerService.info(error);
            }
        );
    }

    public changePassword(changePasswordData: ChangePasswordData): void {
        this.cleanMessage();
        this.loginService.changePassword(changePasswordData.password, changePasswordData.token).subscribe(
            () => {
                // alert(this.resetPasswordSuccessMessage);
                // TODO need to use internationalization
                alert(this.changePasswordSuccessfully);
                this.goToLogin();
            },
            (error) => {
                this.message = error.errorsMessages;
            }
        );
    }

    private goToLogin(): void {
        this.router.navigate(['/public/login', { changedPassword: true }]);
    }

    private cleanMessage(): void {
        this.message = '';
    }
}

export interface ChangePasswordData {
    token: string;
    password: string;
}
