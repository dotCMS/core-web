import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ViewChild,
    AfterViewInit
} from '@angular/core';
import { LoginService } from 'dotcms-js';
import { DotLoginCredentials, DotLoginInformation, DotLoginLanguage } from '@models/dot-login';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { pluck, tap } from 'rxjs/operators';
import { concat, fromEvent, Observable, Subject } from 'rxjs';
import { Dropdown } from 'primeng/primeng';

@Component({
    selector: 'dot-login-component',
    templateUrl: './dot-login.component.html',
    styleUrls: ['./dot-login.component.scss']
})
/**
 * The login component allows the user to fill all
 * the info required to log in the dotCMS angular backend
 */
export class DotLoginComponent implements OnInit, AfterViewInit {
    @Input() message = '';
    @Input() passwordChanged = false;
    @Input() resetEmailSent = false;
    @Input() resetEmail = '';
    @Input()
    set isLoginInProgress(value: boolean) {
        this.disableFormFields(value);
    }
    @Output() recoverPassword = new EventEmitter<any>();
    @Output() login = new EventEmitter<DotLoginCredentials>();

    @ViewChild('languageDropdown') languageDropdown: Dropdown;

    loginForm: FormGroup;
    languages: SelectItem[] = []; // Hacerlo observable.

    loginInfo$: Observable<DotLoginInformation>;

    private languageChange$: Subject<DotLoginInformation> = new Subject<DotLoginInformation>();

    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loginInfo$ = concat(this.route.data, this.languageChange$).pipe(
            pluck('loginFormInfo'),
            tap((loginInfo: DotLoginInformation) => {
                this.setLanguageItems(loginInfo);
                this.checkMessages(loginInfo);
            })
        );
        this.languageChange$.subscribe(x => {
            debugger;
            console.log(x);
        });

        /* this.loginInfo$ = this.route.data.pipe(
            // take(1),
            pluck('loginFormInfo'),
            tap((loginInfo: DotLoginInformation) => this.setLanguageItems(loginInfo)),
            map((loginInfo: DotLoginInformation) => this.setUserNameLabel(loginInfo)),
            tap((loginInfo: DotLoginInformation) => this.checkMessages(loginInfo))
        );*/

        this.loginService.setAuth({
            loginAsUser: null,
            user: null,
            isLoginAs: false
        });

        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            language: [''],
            password: ['', [Validators.required]],
            rememberMe: false
        });
    }

    ngAfterViewInit(): void {
        fromEvent(this.languageDropdown.el.nativeElement, 'Onchange').subscribe(x => {
            debugger;
            console.log(x);
        });
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
        console.log('test');
        /* this.languageChange$.next(
            this.loginService.getLoginFormInfo(this.loginForm.get('language').value, LOGIN_LABELS)
        );*/

        /*   this.loginForm.get('language').setValue(lang);
        debugger;
        fromEvent(this.languageDropdown.el.nativeElement, 'change')
            .pipe(
                take(1),
                switchMap(language => {
                    debugger;
                    console.log(language);
                    return this.loginService.getLoginFormInfo('es', LOGIN_LABELS);
                })
            )
            .subscribe(data => {
                debugger;
                console.log(data);
            });*/

        /*   this.loginService
            .getLoginFormInfo(this.loginForm.get('language').value, LOGIN_LABELS)
            .pipe(
                take(1),
                pluck('bodyJsonObject'),
                map((loginInfo: DotLoginInformation) => this.setUserNameLabel(loginInfo))
            )
            .subscribe(data => this.lc.next(data));*/
    }

    /**
     * Display the forgot password card
     */
    showForgotPassword(): void {
        this.recoverPassword.emit();
    }

    private checkMessages(loginInfo: DotLoginInformation): void {
        if (this.passwordChanged) {
            this.message = loginInfo.i18nMessagesMap['reset-password-success'];
        }
        if (this.resetEmailSent) {
            this.message = loginInfo.i18nMessagesMap['a-new-password-has-been-sent-to-x'].replace(
                '{0}',
                this.resetEmail
            );
        }
    }

    /*private renderPageData(loginInfo: DotLoginInformation): void {
        debugger;
        console.log(loginInfo);
        // this.dataI18n = data.i18nMessagesMap;
        // this.dotSystemInformation = data.entity;

        // this.emailAddressLabel = this.setUserNameLabel();
             // this.isCommunityLicense = this.dotSystemInformation.levelName.indexOf('COMMUNITY') !== -1;
        // this.languages = this.setLanguageItems();
        this.loginForm
            .get('language')
            .setValue(this.setLanguageFormat(this.dotSystemInformation.currentLanguage));

        /!* if (this.passwordChanged) {
            this.message = this.dataI18n['reset-password-success'];
        }
        if (this.resetEmailSent) {
            this.message = this.dataI18n['a-new-password-has-been-sent-to-x'].replace(
                '{0}',
                this.resetEmail
            );
        }*!/

        /!*this.loginService
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
            );*!/
    }*/

    private setLanguageItems(loginInfo: DotLoginInformation): void {
        this.languages =
            this.languages.length === 0
                ? (this.languages = loginInfo.entity.languages.map((lang: DotLoginLanguage) => ({
                      label: lang.displayName,
                      value: this.setLanguageFormat(lang)
                  })))
                : this.languages;
    }

    private setLanguageFormat(lang: DotLoginLanguage): string {
        return lang.language + '_' + lang.country;
    }

    private disableFormFields(disable: boolean): void {
        if (this.loginForm) {
            if (disable) {
                this.loginForm.disable();
            } else {
                this.loginForm.enable();
            }
        }
    }
}
