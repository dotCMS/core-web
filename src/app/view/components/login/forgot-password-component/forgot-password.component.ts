import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { DotLoginInformation } from '@models/dot-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { LoginPageStateService } from '@components/login/shared/services/login-page-state.service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-forgot-password-component',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    @Input() message: string;
    @Output() cancel = new EventEmitter<any>();
    @Output() recoverPassword = new EventEmitter<string>();

    forgotPasswordForm: FormGroup;
    loginInfo$: Observable<DotLoginInformation>;

    private forgotPasswordConfirmationMessage = '';

    constructor(private fb: FormBuilder, public loginPageStateService: LoginPageStateService) {}

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
            this.recoverPassword.emit(this.forgotPasswordForm.get('login').value);
        }
    }
}
