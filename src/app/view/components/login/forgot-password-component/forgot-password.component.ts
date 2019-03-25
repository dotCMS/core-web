import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { DotLoginInformation } from '@models/dot-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { pluck, take, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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

    constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.loginInfo$ = this.route.data.pipe(
            take(1),
            pluck('loginFormInfo'),
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
    submitForgotPassword(): void {
        if (confirm(this.forgotPasswordConfirmationMessage)) {
            this.recoverPassword.emit(this.forgotPasswordForm.get('login').value);
        }
    }
}
