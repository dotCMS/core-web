import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import {DotSystemInformation} from '@models/dot-login';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-forgot-password-component',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    @Input()
    message: string;
    @Output()
    cancel = new EventEmitter<any>();
    @Output()
    recoverPassword = new EventEmitter<string>();

    dataI18n: { [key: string]: string } = {};
    forgotPasswordLogin: string;
    userIdOrEmailLabel = '';
    emailMandatoryFieldError = '';



    private forgotPasswordConfirmationMessage = '';
    private language = '';
    private i18nMessages: Array<string> = [
        'error.form.mandatory',
        'user-id',
        'email-address',
        'forgot-password',
        'get-new-password',
        'cancel',
        'an-email-with-instructions-will-be-sent'
    ];

    constructor(private loginService: LoginService, private loggerService: LoggerService) {}

    ngOnInit(): void {
        this.loadLabels();
    }

    /**
     * Executes the recover password service
     */
    ok(): void {
        if (confirm(this.forgotPasswordConfirmationMessage)) {
            this.recoverPassword.emit(this.forgotPasswordLogin);
        }
    }

    /**
     * Update the color and or image according to the values specified
     */
    private loadLabels(): void {
        this.loginService.getLoginFormInfo(this.language, this.i18nMessages).subscribe(
            (data) => {
                // Translate labels and messages
                this.dataI18n = data.i18nMessagesMap;
                const dotSystemInformation: DotSystemInformation = data.entity;

                if ('emailAddress' === dotSystemInformation.authorizationType) {
                    this.userIdOrEmailLabel = this.dataI18n['email-address'];
                } else {
                    this.userIdOrEmailLabel = this.dataI18n['user-id'];
                }


                this.forgotPasswordConfirmationMessage =
                    this.dataI18n['an-email-with-instructions-will-be-sent'];
                this.emailMandatoryFieldError = this.dataI18n['error.form.mandatory'].replace(
                    '{0}',
                    this.userIdOrEmailLabel
                );
            },
            (error) => {
                this.loggerService.error(error);
            }
        );
    }
}
