import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotLoginInformation, DotSystemInformation } from '@models/dot-login';
import { map, pluck, tap } from 'rxjs/operators';

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
    'reset-password-confirmation-do-not-match'
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
        return this.loginService.getLoginFormInfo('', LOGIN_LABELS).pipe(
            pluck('bodyJsonObject'),
            map((loginInfo: DotLoginInformation) => this.setUserNameLabel(loginInfo)),
            tap((loginInfo: DotLoginInformation) => {
                document.body.style.backgroundColor = this.setBackgroundColor(loginInfo.entity);
                document.body.style.backgroundImage = this.setBackgroundImage(loginInfo.entity);
            })
        );
    }

    private setBackgroundColor(systemInformation: DotSystemInformation): string {
        return systemInformation.backgroundColor !== 'undefined' &&
            systemInformation.backgroundColor !== ''
            ? systemInformation.backgroundColor
            : '';
    }

    private setBackgroundImage(systemInformation: DotSystemInformation): string {
        return systemInformation.backgroundPicture !== 'undefined' &&
            systemInformation.backgroundPicture !== ''
            ? 'url(' + systemInformation.backgroundPicture + ')'
            : '';
    }

    private setUserNameLabel(loginInfo: DotLoginInformation): DotLoginInformation {
        loginInfo.i18nMessagesMap['emailAddressLabel'] =
            'emailAddress' === loginInfo.entity.authorizationType
                ? loginInfo.i18nMessagesMap['email-address']
                : loginInfo.i18nMessagesMap['user-id'];
        return loginInfo;
    }
}
