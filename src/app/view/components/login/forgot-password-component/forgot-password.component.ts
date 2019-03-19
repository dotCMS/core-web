import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import { DotSystemInformation } from '@models/dot-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-forgot-password-component',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {
    @Input() message: string;
    @Output() cancel = new EventEmitter<any>();
    @Output() recoverPassword = new EventEmitter<string>();
    @ViewChild('emailInput') emailInput: ElementRef;

    forgotPasswordForm: FormGroup;
    dataI18n: { [key: string]: string } = {};
    userIdOrEmailLabel = '';

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

    constructor(
        private loginService: LoginService,
        private loggerService: LoggerService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({
            login: ['', [Validators.required]]
        });

        this.loadLabels();
    }

    ngAfterViewInit(): void {
        this.emailInput.nativeElement.focus();
    }

    /**
     * Executes the recover password service
     */
    ok(): void {
        if (confirm(this.forgotPasswordConfirmationMessage)) {
            this.recoverPassword.emit(this.forgotPasswordForm.get('login').value);
        }
    }

    /**
     * Update the color and or image according to the values specified
     */
    private loadLabels(): void {
        this.loginService.getLoginFormInfo(this.language, this.i18nMessages).subscribe(
            data => {
                this.dataI18n = data.i18nMessagesMap;
                const dotSystemInformation: DotSystemInformation = data.entity;

                this.userIdOrEmailLabel =
                    'emailAddress' === dotSystemInformation.authorizationType
                        ? this.dataI18n['email-address']
                        : this.dataI18n['user-id'];

                this.forgotPasswordConfirmationMessage = this.dataI18n[
                    'an-email-with-instructions-will-be-sent'
                ];
            },
            error => {
                this.loggerService.error(error);
            }
        );
    }
}
