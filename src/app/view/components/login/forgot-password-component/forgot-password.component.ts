import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DotLoginInformation } from '@models/dot-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';
import { LoginService, ResponseView } from 'dotcms-js';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-forgot-password-component',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    message = '';

    forgotPasswordForm: FormGroup;
    loginInfo$: Observable<DotLoginInformation>;

    private forgotPasswordConfirmationMessage = '';

    constructor(
        private fb: FormBuilder,
        public loginPageStateService: LoginPageStateService,
        private dotRouterService: DotRouterService,
        private loginService: LoginService
    ) {}

    ngOnInit(): void {
        this.loginInfo$ = this.loginPageStateService.dotLoginInformation.pipe(
            take(1),
            tap((loginInfo: DotLoginInformation) => {
                this.forgotPasswordConfirmationMessage =
                    loginInfo.i18nMessagesMap['an-email-with-instructions-will-be-sent'];
            })
        );
        this.forgotPasswordForm = this.fb.group({
            login: ['', [Validators.required]]
        });
    }

    /**
     * Executes the recover password service
     */
    submit(): void {
        if (confirm(this.forgotPasswordConfirmationMessage)) {
            this.message = '';
            this.loginService
                .recoverPassword(this.forgotPasswordForm.get('login').value)
                .pipe(take(1))
                .subscribe(
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
    }

    /**
     * Executes the recover password service
     */
    goToLogin(): void {
        this.dotRouterService.goToLogin({
            resetEmailSent: true,
            resetEmail: this.forgotPasswordForm.get('login').value
        });
    }
}
