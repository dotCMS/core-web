import { CoreWebService, ApiRoot } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { DotEnvironment } from '../../../shared/models/dot-environment/dot-environment';
import { AjaxActionResponseView } from '../../../shared/models/ajax-action-response/ajax-action-response';

/**
 * Provide method to push publish to content types
 * @export
 * @class PushPublishService
 */
@Injectable()
export class PushPublishService {
    private pushEnvironementsUrl= `${this._apiRoot.baseUrl}api/environment/loadenvironments/roleId`;
    private currentUsersUrl = `${this._apiRoot.baseUrl}api/v1/users/current/`;
    private publishUrl = `${this._apiRoot.baseUrl}DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish`;

    constructor(public _apiRoot: ApiRoot, private coreWebService: CoreWebService) {}

    /**
     * Get push publish environments.
     * @returns {Observable<any>}
     * @memberof PushPublishService
     */
    getEnvironments(): Observable<DotEnvironment[]> {
        return this.getCurrentUser().flatMap(user => {
            return this.coreWebService.request({
                method: RequestMethod.Get,
                url: `${this.pushEnvironementsUrl}/${user.roleId}/name=0`
            });
        })
        .flatMap((environments: DotEnvironment[]) => environments)
        .filter(environment => environment.name !== '')
        .toArray();
    }

    /**
     * Push publish asset to specified environment.
     * @param {string} contentTypeId
     * @param {*} formValue
     * @returns {Observable<AjaxActionResponseView>}
     * @memberof PushPublishService
     */
    pushPublishContent(contentTypeId: string, formValue: any): Observable<AjaxActionResponseView> {
        return this.coreWebService.request({
            body: this.getPublishEnvironmentData(contentTypeId, formValue),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: RequestMethod.Post,
            url: this.publishUrl
        });
    }

    /**
     * Get logged user and role id.
     * // TODO: We need to update the LoginService to get the roleid in the User object
     * @returns {Observable<any>}
     * @memberof PushPublishService
     */
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

