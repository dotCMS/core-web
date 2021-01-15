import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoreWebService, ResponseView } from 'dotcms-js';

@Injectable()
export class AccountService {
    constructor(private coreWebService: CoreWebService) {}

    public updateUser(user: AccountUser): Observable<ResponseView> {
        return this.coreWebService.requestView({
            body: user,
            method: 'PUT',
            url: 'v1/users/current'
        });
    }

    public addStarterPage(): Observable<ResponseView> {
        return this.coreWebService.requestView({
            method: 'PUT',
            url: '/api/v1/toolgroups/gettingstarted/_addtocurrentuser'
        });
    }

    public removeStarterPage(): Observable<ResponseView> {
        return this.coreWebService.requestView({
            method: 'PUT',
            url: '/api/v1/toolgroups/gettingstarted/_removefromcurrentuser'
        });
    }
}

export interface AccountUser {
    userId: string;
    givenName: string;
    surname: string;
    newPassword?: string;
    currentPassword: string;
    email: string;
}
