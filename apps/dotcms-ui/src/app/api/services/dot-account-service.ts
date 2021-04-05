import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoreWebService, ResponseView } from '@dotcms/dotcms-js';
import { take, pluck } from 'rxjs/operators';

@Injectable()
export class DotAccountService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Updates user data
     *
     * @param {DotAccountUser} user
     * @returns {Observable<ResponseView>}
     * @memberof DotAccountService
     */
    updateUser(user: DotAccountUser): Observable<ResponseView> {
        return this.coreWebService.requestView({
            body: user,
            method: 'PUT',
            url: 'v1/users/current'
        });
    }

    /**
     * Put request to add the getting starter portlet to menu
     *
     * @returns {Observable<string>}
     * @memberof DotAccountService
     */
    addStarterPage(): Observable<string> {
        return this.coreWebService
            .requestView({
                method: 'PUT',
                url: '/api/v1/toolgroups/gettingstarted/_addtouser'
            })
            .pipe(take(1), pluck('entity'));
    }

    /**
     * put request to remove the getting starter portlet to menu
     *
     * @returns {Observable<string>}
     * @memberof DotAccountService
     */
    removeStarterPage(): Observable<string> {
        return this.coreWebService
            .requestView({
                method: 'PUT',
                url: '/api/v1/toolgroups/gettingstarted/_removefromuser'
            })
            .pipe(take(1), pluck('entity'));
    }
}

export interface DotAccountUser {
    userId: string;
    givenName: string;
    surname: string;
    newPassword?: string;
    currentPassword: string;
    email: string;
}
