import { AccountService, AccountUser } from '@services/account-service';
import {
    Component,
    EventEmitter,
    Output,
    ViewEncapsulation,
    Input,
    OnInit,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DotDialogAction } from '@components/dot-dialog/dot-dialog.component';
import { DotMessageService } from '@services/dot-messages-service';
import { DotcmsConfig } from 'dotcms-js/dotcms-js';
import { LoginService, User, Auth } from 'dotcms-js/dotcms-js';
import { StringFormat } from '../../../api/util/stringFormat';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-my-account',
    styleUrls: ['./dot-my-account-component.scss'],
    templateUrl: 'dot-my-account-component.html'
})
export class MyAccountComponent implements OnInit, OnDestroy {
    @ViewChild('myAccountForm')
    form: NgForm;

    @Output()
    close = new EventEmitter<any>();

    @Input()
    visible: boolean;

    emailRegex: string;
    passwordMatch: boolean;

    accountUser: AccountUser = {
        currentPassword: '',
        email: '',
        givenName: '',
        surname: '',
        userId: ''
    };

    passwordConfirm: string;
    message = null;
    changePasswordOption = false;

    i18nMessages: {
        [key: string]: string;
    } = {};

    dialogOk: DotDialogAction;
    dialogCancel: DotDialogAction;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotMessageService: DotMessageService,
        private accountService: AccountService,
        private dotcmsConfig: DotcmsConfig,
        private loginService: LoginService,
        private stringFormat: StringFormat
    ) {
        this.passwordMatch = false;
        this.changePasswordOption = false;
        this.loginService.watchUser(this.loadUser.bind(this));
        this.dotcmsConfig.getConfig().subscribe((res) => {
            this.emailRegex = res.emailRegex;
        });
    }

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'my-account',
                'modes.Close',
                'save',
                'error.form.mandatory',
                'errors.email',
                'First-Name',
                'Last-Name',
                'email-address',
                'new-password',
                're-enter-new-password',
                'error.forgot.password.passwords.dont.match',
                'message.createaccount.success',
                'Error-communicating-with-server-Please-try-again',
                'change-password',
                'current-password'
            ])
            .subscribe((res) => {
                this.i18nMessages = res;

                this.dialogOk = {
                    label: this.i18nMessages['save'],
                    action: () => {
                        this.save();
                    },
                    disabled: true
                };

                this.dialogCancel = {
                    label: this.i18nMessages['modes.Close'],
                    action: () => {
                        this.close.emit();
                    }
                };
            });

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.dialogOk = {
                ...this.dialogOk,
                disabled: (this.changePasswordOption && !this.passwordMatch) || !this.form.valid
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    checkPasswords(): void {
        if (this.message) {
            this.message = null;
        }
        this.passwordMatch =
            this.accountUser.newPassword !== '' &&
            this.passwordConfirm !== '' &&
            this.accountUser.newPassword === this.passwordConfirm;
    }

    toggleChangePasswordOption(): void {
        this.changePasswordOption = !this.changePasswordOption;
    }

    getRequiredMessage(item): string {
        return this.stringFormat.formatMessage(this.i18nMessages['error.form.mandatory'], item);
    }

    save(): void {
        this.accountService.updateUser(this.accountUser).subscribe(
            (response) => {
                // TODO: replace the alert with a Angular components
                alert(this.i18nMessages['message.createaccount.success']);
                this.close.emit();

                if (response.entity.reauthenticate) {
                    this.loginService.logOutUser().subscribe(() => {});
                } else {
                    this.loginService.setAuth({
                        loginAsUser: null,
                        user: response.entity.user
                    });
                }
            },
            (response) => {
                // TODO: We have to define how must be the user feedback in case of error
                this.message = response.errorsMessages;
            }
        );
    }

    private loadUser(auth: Auth): void {
        const user: User = auth.user;
        this.accountUser.email = user.emailAddress;
        this.accountUser.givenName = user.firstName;
        this.accountUser.surname = user.lastName;
        this.accountUser.userId = user.userId;
        this.accountUser.newPassword = null;
        this.passwordConfirm = null;
    }
}
