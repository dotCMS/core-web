import { Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import { ChangePasswordData } from './reset-password-container.component';

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

    dataI18n: { [key: string]: string } = {};

    // labels

    confirmPassword = '';
    password = '';

    private language = '';
    // Message
    private i18nMessages: Array<string> = [
        'error.form.mandatory',
        'reset-password',
        'enter-password',
        're-enter-password',
        'change-password',
        'reset-password-success',
        'reset-password-confirmation-do-not-match'
    ];

    constructor(private loginService: LoginService, private loggerService: LoggerService) {}

    ngOnInit(): void {
        this.loginService.getLoginFormInfo(this.language, this.i18nMessages).subscribe(
            data => {
                this.dataI18n = data.i18nMessagesMap;
            },
            error => {
                this.loggerService.error(error);
            }
        );
    }

    cleanConfirmPassword(): void {
        this.clean();
        this.confirmPassword = '';
    }

    ok(): void {
        if (this.password === this.confirmPassword) {
            this.changePassword.emit({
                password: this.password,
                token: this.token
            });
        } else {
            this.message = this.dataI18n['reset-password-confirmation-do-not-match'];
        }
    }

    clean(): void {
        this.message = '';
    }
}
