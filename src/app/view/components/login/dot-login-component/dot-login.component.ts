import {
    Component,
    EventEmitter,
    Input,
    NgZone,
    Output,
    ViewEncapsulation,
    AfterViewInit,
    OnInit
} from '@angular/core';
import { LoginService, LoggerService } from 'dotcms-js';
import { DotLoginData, DotLoginLanguage, DotSystemInformation } from '@models/dot-login';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
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

    dotLoginData: DotLoginData = {
        language: '',
        login: '',
        password: '',
        rememberMe: false
    };
    languages: Array<any> = [];

    dotSystemInformation: DotSystemInformation;

    // labels
    dataI18n: { [key: string]: string } = {};

    isCommunityLicense = true;
    userIdOrEmailLabel = '';

    private emailAddressLabel = '';

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
        private ngZone: NgZone,
        private loggerService: LoggerService
    ) {
        this.renderPageData();
    }

    ngOnInit() {
        this.loginService.setAuth({
            loginAsUser: null,
            user: null,
            isLoginAs: false
        });
    }

    ngAfterViewInit(): void {
        this.ngZone.runOutsideAngular(() =>
            setTimeout(() => document.getElementById('login-component-login-input').focus())
        );
    }

    /**
     *  Executes the logIn service
     */
    logInUser(_$event: any): void {
        const isSetUserId =
            this.dotLoginData.login !== undefined && this.dotLoginData.login.length > 0;
        const isSetPassword =
            this.dotLoginData.password !== undefined && this.dotLoginData.password.length > 0;
        this.message = '';

        if (isSetUserId && isSetPassword) {
            this.login.emit(this.dotLoginData);
        } else {
            let error = '';
            if (!isSetUserId) {
                error += this.dataI18n['error.form.mandatory'].replace(
                    '{0}',
                    this.emailAddressLabel
                );
            }

            if (!isSetPassword) {
                if (error !== '') {
                    error += '<br>';
                }
                error += this.dataI18n['error.form.mandatory'].replace(
                    '{0}',
                    this.dataI18n['password']
                );
            }
            this.message = error;
            this.isLoginInProgress = false;
        }
    }

    /**
     * Execute the change language service
     */
    changeLanguage(lang: DotLoginLanguage): void {
        this.dotLoginData.language = this.setLanguageFormat(lang);
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
        this.loginService.getLoginFormInfo(this.dotLoginData.language, this.i18nMessages).subscribe(
            data => {
                this.dataI18n = data.i18nMessagesMap;
                this.dotSystemInformation = data.entity;

                this.emailAddressLabel =
                    'emailAddress' === this.dotSystemInformation.authorizationType
                        ? (this.userIdOrEmailLabel = this.dataI18n['email-address'])
                        : (this.userIdOrEmailLabel = this.dataI18n['user-id']);

                this.isCommunityLicense =
                    this.dotSystemInformation.levelName.indexOf('COMMUNITY') !== -1;

                // Configure languages
                if (this.languages.length === 0) {
                    this.languages = this.dotSystemInformation.languages.map(
                        lang => (lang.language = this.setLanguageFormat(lang))
                    );
                    this.dotLoginData.language = this.setLanguageFormat(
                        this.dotSystemInformation.currentLanguage
                    );
                }

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

    private setLanguageFormat(lang: DotLoginLanguage): string {
        return lang.language + '_' + lang.country;
    }
}
