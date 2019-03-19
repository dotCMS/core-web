import {
    Component,
    EventEmitter,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import { DotLoginData, DotLoginLanguage, DotSystemInformation } from '@models/dot-login';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'dot-login-component',
    templateUrl: './dot-login.component.html',
    styleUrls: ['./dot-login.component.scss']
})
/**
 * The login component allows the user to fill all
 * the info required to log in the dotCMS angular backend
 */
export class DotLoginComponent implements AfterViewInit, OnInit {
    @Input() isLoginInProgress = false;

    @Input() message = '';

    @Input() passwordChanged = false;

    @Input() resetEmailSent = false;

    @Input() resetEmail = '';

    @Output() recoverPassword = new EventEmitter<any>();

    @Output() login = new EventEmitter<DotLoginData>();

    @ViewChild('emailInput') emailInput: ElementRef;

    loginForm: FormGroup;
    languages: SelectItem[] = [];
    dotSystemInformation: DotSystemInformation;

    dataI18n: { [key: string]: string } = {};

    isCommunityLicense = true;
    userIdOrEmailLabel = '';
    emailAddressLabel = '';

    private i18nMessages: Array<string> = [
        'email-address',
        'user-id',
        'password',
        'remember-me',
        'sign-in',
        'get-new-password',
        'cancel',
        'Server',
        'error.form.mandatory',
        'angular.login.component.community.licence.message',
        'reset-password-success',
        'a-new-password-has-been-sent-to-x',
        'welcome-back'
    ];

    constructor(
        private loginService: LoginService,
        private loggerService: LoggerService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.loginService.setAuth({
            loginAsUser: null,
            user: null,
            isLoginAs: false
        });
        this.loginForm = this.fb.group({
            login: [{ value: '', disabled: this.isLoginInProgress }, [Validators.required]],
            language: [{ value: '', disabled: this.isLoginInProgress }],
            password: [{ value: '', disabled: this.isLoginInProgress }, [Validators.required]],
            rememberMe: false
        });
        this.renderPageData();
    }

    ngAfterViewInit(): void {
        this.emailInput.nativeElement.focus();
    }

    /**
     *  Executes the logIn service
     */
    logInUser(): void {
        if (this.loginForm.valid) {
            this.login.emit(this.loginForm.value);
        }
    }

    /**
     * Execute the change language service
     */
    changeLanguage(lang: string): void {
        this.loginForm.get('language').setValue(lang);
        this.renderPageData();
    }

    /**
     * Display the forgot password card
     */
    showForgotPassword(): void {
        this.recoverPassword.emit();
    }

    /**
     * Renders all the labels, images, and placeholder values for the Log In page.
     */
    private renderPageData(): void {
        this.loginService
            .getLoginFormInfo(this.loginForm.get('language').value, this.i18nMessages)
            .subscribe(
                data => {
                    this.dataI18n = data.i18nMessagesMap;
                    this.dotSystemInformation = data.entity;

                    this.emailAddressLabel = this.setUserNameLabel();
                    this.isCommunityLicense =
                        this.dotSystemInformation.levelName.indexOf('COMMUNITY') !== -1;
                    this.languages = this.setLanguageItems();
                    this.loginForm
                        .get('language')
                        .setValue(
                            this.setLanguageFormat(this.dotSystemInformation.currentLanguage)
                        );

                    if (this.passwordChanged) {
                        this.message = this.dataI18n['reset-password-success'];
                    }
                    if (this.resetEmailSent) {
                        this.message = this.dataI18n['a-new-password-has-been-sent-to-x'].replace(
                            '{0}',
                            this.resetEmail
                        );
                    }
                },
                error => {
                    this.loggerService.debug(error);
                }
            );
    }

    private setUserNameLabel(): string {
        return 'emailAddress' === this.dotSystemInformation.authorizationType
            ? (this.userIdOrEmailLabel = this.dataI18n['email-address'])
            : (this.userIdOrEmailLabel = this.dataI18n['user-id']);
    }

    private setLanguageItems(): SelectItem[] {
        return this.languages.length === 0
            ? (this.languages = this.dotSystemInformation.languages.map(
                  (lang: DotLoginLanguage) => ({
                      label: lang.displayName,
                      value: this.setLanguageFormat(lang)
                  })
              ))
            : this.languages;
    }

    private setLanguageFormat(lang: DotLoginLanguage): string {
        return lang.language + '_' + lang.country;
    }
}
