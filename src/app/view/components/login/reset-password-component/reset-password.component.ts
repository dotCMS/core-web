import { Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangePasswordData } from '../reset-password-container-component/reset-password-container.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DotLoginInformation } from '@models/dot-login';
import { pluck, take, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [],
    selector: 'dot-reset-password-component',
    styleUrls: ['./reset-password.component.scss'],
    templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    @Input() token = '';
    @Input() message = '';
    @Output() changePassword = new EventEmitter<ChangePasswordData>();

    resetPasswordForm: FormGroup;
    loginInfo$: Observable<DotLoginInformation>;
    private passwordDontMatchMessage = '';

    constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.loginInfo$ = this.route.parent.parent.data.pipe(
            take(1),
            pluck('loginFormInfo'),
            tap((loginInfo: DotLoginInformation) => {
                this.passwordDontMatchMessage =
                    loginInfo.i18nMessagesMap['reset-password-confirmation-do-not-match'];
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
            this.changePassword.emit({
                password: this.resetPasswordForm.get('password').value,
                token: this.token
            });
        } else {
            this.message = this.passwordDontMatchMessage;
        }
    }
}
