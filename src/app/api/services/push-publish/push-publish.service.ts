import { CoreWebService, ApiRoot, LoginService } from 'dotcms-js/dotcms-js';
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
    private pushRuleUrl: string;

    constructor(public _apiRoot: ApiRoot, private coreWebService: CoreWebService, loginService: LoginService) {
        this.pushEnvironementsUrl = `${this._apiRoot.baseUrl}api/environment/loadenvironments/roleId`;
        this.currentUsersUrl =  `${this._apiRoot.baseUrl}api/v1/users/current/`;
        this.pushRuleUrl = `${this._apiRoot.baseUrl}DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish`;
    }

    loadPushPublishEnv(): Observable<any[]> {
        return this.getCurrentUser().flatMap(user => {
            return this.coreWebService.request({
                method: RequestMethod.Get,
                url: `${this.pushEnvironementsUrl}/${user.roleId}/name=0`
            });
        });
    }

    getCurrentUser(): Observable<any> {
        return this.coreWebService.request({
            method: RequestMethod.Get,
            url: this.currentUsersUrl
        });
    }

    pushPublishContentType(contentTypeId: string): Observable<any> {
        return this.coreWebService.request({
            body: this.getPublishRuleData(contentTypeId),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: RequestMethod.Post,
            url: this.pushRuleUrl
        });
    }

    private getFormattedDate(date: Date): string {
        const yyyy = date.getFullYear().toString();
        const mm = (date.getMonth() + 1).toString();
        const dd  = date.getDate().toString();
        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
    }

    private getPublishRuleData(contentTypeId: string): string {
        let result = '';
        result += `assetIdentifier=${contentTypeId}`;
        result += `&remotePublishDate=${this.getFormattedDate(new Date())}`;
        result += '&remotePublishTime=00-00';
        result += `&remotePublishExpireDate=${this.getFormattedDate(new Date())}`;
        result += '&remotePublishExpireTime=00-00';
        result += '&iWantTo=publish';
        result += '&whoToSend=';
        result += '&bundleName=';
        result += '&bundleSelect=';
        result += '&forcePush=false';
        return result;
    }
}
