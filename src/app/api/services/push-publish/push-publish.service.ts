import { CoreWebService, ApiRoot } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';

/**
 * Provide method to push publish to content types
 * @export
 * @class PushPublishService
 */
@Injectable()
export class PushPublishService {
    private pushEnvironementsUrl: string;
    private currentUsersUrl: string;
    private publishUrl: string;

    constructor(public _apiRoot: ApiRoot, private coreWebService: CoreWebService) {
        this.pushEnvironementsUrl = `${this._apiRoot.baseUrl}api/environment/loadenvironments/roleId`;
        this.currentUsersUrl =  `${this._apiRoot.baseUrl}api/v1/users/current/`;
        this.publishUrl = `${this._apiRoot.baseUrl}DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish`;
    }

    getEnvironments(): Observable<any> {
        return this.getCurrentUser().flatMap(user => {
            return this.coreWebService.request({
                method: RequestMethod.Get,
                url: `${this.pushEnvironementsUrl}/${user.roleId}/name=0`
            });
        })
        .map(environments => environments.filter(environment => environment.name !== ''));
    }

    pushPublishContent(contentTypeId: string, formValue: any): Observable<PushPublishResponse> {
        return this.coreWebService.request({
            body: this.getPublishEnvironmentData(contentTypeId, formValue),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: RequestMethod.Post,
            url: this.publishUrl
        });
    }

    getCurrentUser(): Observable<any> {
        return this.coreWebService.request({
            method: RequestMethod.Get,
            url: this.currentUsersUrl
        });
    }

    private getFormattedDate(date: Date): string {
        const yyyy = date.getFullYear().toString();
        const mm = (date.getMonth() + 1).toString();
        const dd  = date.getDate().toString();
        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
    }

    private getPublishEnvironmentData(contentTypeId: string, formValue: any): string {
        let result = '';
        result += `assetIdentifier=${contentTypeId}`;
        result += `&remotePublishDate=${this.getFormattedDate(formValue.publishdate)}`;
        result += '&remotePublishTime=00-00';
        result += `&remotePublishExpireDate=${this.getFormattedDate(formValue.expiredate)}`;
        result += '&remotePublishExpireTime=00-00';
        result += `&iWantTo=${formValue.pushActionSelected}`;
        result += `&whoToSend=${formValue.environment}`;
        result += '&bundleName=';
        result += '&bundleSelect=';
        result += `&forcePush=${formValue.forcePush}`;
        return result;
    }
}

export interface PushPublishResponse {
    errorMessages: string[];
    total: number;
    bundleId: string;
    errors: number;
}
