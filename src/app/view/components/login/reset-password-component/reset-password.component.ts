import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DotLoginInformation } from '@models/dot-login';
import { take, tap } from 'rxjs/operators';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';
import { LoginService } from 'dotcms-js';
import { ActivatedRoute } from '@angular/router';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [],
    selector: 'dot-reset-password-component',
    styleUrls: ['./reset-password.component.scss'],
    templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    loginInfo$: Observable<DotLoginInformation>;
    message = '';
    private passwordDontMatchMessage = '';
    private changePasswordSuccessfully = '';

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        public loginPageStateService: LoginPageStateService,
        private dotRouterService: DotRouterService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.loginInfo$ = this.loginPageStateService.dotLoginInformation.pipe(
            take(1),
            tap((loginInfo: DotLoginInformation) => {
                this.passwordDontMatchMessage =
                    loginInfo.i18nMessagesMap['reset-password-confirmation-do-not-match'];
                this.changePasswordSuccessfully =
                    loginInfo.i18nMessagesMap['message.forgot.password.password.updated'];
            })
        );

        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    cleanConfirmPassword(): void {
        this.cleanMessage();
        this.resetPasswordForm.get('confirmPassword').setValue('');
    }

    cleanMessage(): void {
        this.message = '';
    }

    submit(): void {
        if (
            this.resetPasswordForm.valid &&
            this.resetPasswordForm.get('password').value ===
                this.resetPasswordForm.get('confirmPassword').value
        ) {
            this.cleanMessage();
            this.loginService
                .changePassword(
                    this.resetPasswordForm.get('password').value,
                    this.route.snapshot.paramMap.get('token')
                )
                .pipe(take(1))
                .subscribe(
                    () => {
                        alert(this.changePasswordSuccessfully);
                        this.dotRouterService.goToLogin({ changedPassword: true });
                    },
                    error => {
                        this.message = error.errorsMessages;
                    }
                );
        } else {
            this.message = this.passwordDontMatchMessage;
        }
    }
}
