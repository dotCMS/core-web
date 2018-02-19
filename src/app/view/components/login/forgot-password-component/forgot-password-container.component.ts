import { Component, ViewEncapsulation } from '@angular/core';
import { LoginService, ResponseView } from 'dotcms-js/dotcms-js';
import { DotRouterService } from '../../../../api/services/dot-router-service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-forgot-password-container',
    template: `
        <dot-forgot-password-component
            [message]="message"
            (cancel)="goToLogin()"
            (recoverPassword)="recoverPassword($event)"
        ></dot-forgot-password-component>
    `
})
export class ForgotPasswordContainerComponent {
    public message = '';
    private email = '';

    constructor(private loginService: LoginService, private router: DotRouterService) {}

    recoverPassword(forgotPasswordLogin: string): void {
        this.message = '';
        this.email = forgotPasswordLogin;

        this.loginService.recoverPassword(forgotPasswordLogin).subscribe(
            () => {
                this.goToLogin();
            },
            (resp: ResponseView) => {
                if (!resp.existError('a-new-password-has-been-sent-to-x')) {
                    this.message = resp.errorsMessages;
                } else {
                    this.goToLogin();
                }
            }
        );
    }

    goToLogin(): void {
        this.router.goToLogin({ resetEmailSent: true, resetEmail: this.email });
    }
}
