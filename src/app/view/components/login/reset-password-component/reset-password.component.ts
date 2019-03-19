import {
    Component,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    OnInit,
    AfterViewInit,
    ViewChild, ElementRef
} from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import { ChangePasswordData } from './reset-password-container.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [],
    selector: 'dot-reset-password-component',
    styleUrls: ['./reset-password.component.scss'],
    templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
    @Input() token = '';
    @Input() message = '';
    @Output() changePassword = new EventEmitter<ChangePasswordData>();
    @ViewChild('newPasswordInput') newPasswordInput: ElementRef;


    resetPasswordForm: FormGroup;
    dataI18n: { [key: string]: string } = {};

    private i18nMessages: Array<string> = [
        'error.form.mandatory',
        'reset-password',
        'enter-password',
        're-enter-password',
        'change-password',
        'reset-password-success',
        'reset-password-confirmation-do-not-match'
    ];

    constructor(
        private loginService: LoginService,
        private loggerService: LoggerService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.loginService.getLoginFormInfo('', this.i18nMessages).subscribe(
            data => {
                this.dataI18n = data.i18nMessagesMap;
            },
            error => {
                this.loggerService.error(error);
            }
        );

        this.resetPasswordForm = this.fb.group({
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    ngAfterViewInit(): void {
        this.newPasswordInput.nativeElement.focus();
    }

    cleanConfirmPassword(): void {
        this.clean();
        this.resetPasswordForm.get('confirmPassword').setValue('');
    }

    ok(): void {
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
            this.message = this.dataI18n['reset-password-confirmation-do-not-match'];
        }
    }

    clean(): void {
        this.message = '';
    }
}
