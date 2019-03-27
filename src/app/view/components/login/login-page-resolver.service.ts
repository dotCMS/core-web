import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotLoginInformation } from '@models/dot-login';
import { pluck } from 'rxjs/operators';

export const LOGIN_LABELS = [
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
    'welcome-back',
    'forgot-password',
    'get-new-password',
    'cancel',
    'an-email-with-instructions-will-be-sent',
    'reset-password',
    'enter-password',
    're-enter-password',
    'change-password',
    'reset-password-confirmation-do-not-match',
    'message.forgot.password.password.updated'
];

/**
 *
 * @export
 * @class LoginPageResolver
 * @implements {Resolve<any>}
 */
@Injectable()
export class LoginPageResolver implements Resolve<DotLoginInformation> {
    constructor(private loginService: LoginService) {}

    resolve(): Observable<DotLoginInformation> {
        return this.loginService.getLoginFormInfo('', LOGIN_LABELS).pipe(pluck('bodyJsonObject'));
    }
}
