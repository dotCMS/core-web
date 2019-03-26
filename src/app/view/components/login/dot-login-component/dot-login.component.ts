import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { LoginService } from 'dotcms-js';
import { DotLoginCredentials, DotLoginInformation, DotLoginLanguage } from '@models/dot-login';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { Dropdown } from 'primeng/primeng';
import { LOGIN_LABELS } from '@components/login/login-page-resolver.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    selector: 'dot-login-component',
    templateUrl: './dot-login.component.html',
    styleUrls: ['./dot-login.component.scss']
})
/**
 * The login component allows the user to fill all
 * the info required to log in the dotCMS angular backend
 */
export class DotLoginComponent implements OnInit, OnDestroy {
    @Input() message = '';
    @Input() passwordChanged = false;
    @Input() resetEmailSent = false;
    @Input() resetEmail = '';
    @Input()
    set isLoginInProgress(value: boolean) {
        this.setFormState(value);
    }
    @Output() login = new EventEmitter<DotLoginCredentials>();

    @ViewChild('languageDropdown') languageDropdown: Dropdown;

    loginForm: FormGroup;
    languages: SelectItem[] = [];

    loginInfo$: Observable<DotLoginInformation>;

    private languageChange$: Subject<DotLoginInformation> = new Subject<DotLoginInformation>();
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private dotRouterService: DotRouterService
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            language: [''],
            password: ['', [Validators.required]],
            rememberMe: false
        });

        const onLanguageChange = this.languageChange$
            .asObservable()
            .pipe(
                takeUntil(this.destroy$),
                switchMap((event: any) =>
                    this.loginService
                        .getLoginFormInfo(event, LOGIN_LABELS)
                        .pipe(
                            map((loginInfo: DotLoginInformation) => ({ loginFormInfo: loginInfo }))
                        )
                )
            );

        this.loginInfo$ = merge(this.route.parent.parent.data, onLanguageChange).pipe(
            takeUntil(this.destroy$),
            pluck('loginFormInfo'),
            map((loginInfo: DotLoginInformation) => this.setUserNameLabel(loginInfo)),
            tap((loginInfo: DotLoginInformation) => {
                this.setInitialFormValues(loginInfo);
            })
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /**
     *  Executes the logIn service
     */
    logInUser(): void {
        this.login.emit(this.loginForm.value);
    }

    /**
     * Display the forgot password card
     */
    showForgotPassword(): void {
        this.dotRouterService.goToForgotPassword();
    }

    private setInitialFormValues(loginInfo: DotLoginInformation): void {
        this.loginForm
            .get('language')
            .setValue(this.getLanguageFormatted(loginInfo.entity.currentLanguage));
        this.setLanguageItems(loginInfo.entity.languages);
        this.setMessage(loginInfo);
    }

    private setMessage(loginInfo: DotLoginInformation): void {
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

    private setLanguageItems(languages: DotLoginLanguage[]): void {
        this.languages =
            this.languages.length === 0
                ? (this.languages = languages.map((lang: DotLoginLanguage) => ({
                      label: lang.displayName,
                      value: this.getLanguageFormatted(lang)
                  })))
                : this.languages;
    }

    private getLanguageFormatted(lang: DotLoginLanguage): string {
        return lang.language + '_' + lang.country;
    }

    private setFormState(disable: boolean): void {
        if (this.loginForm) {
            if (disable) {
                this.loginForm.disable();
            } else {
                this.loginForm.enable();
            }
        }
    }

    private setUserNameLabel(loginInfo: DotLoginInformation): DotLoginInformation {
        loginInfo.i18nMessagesMap['emailAddressLabel'] =
            'emailAddress' === loginInfo.entity.authorizationType
                ? loginInfo.i18nMessagesMap['email-address']
                : loginInfo.i18nMessagesMap['user-id'];
        return loginInfo;
    }
}
