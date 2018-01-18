import { CoreWebService, ApiRoot } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { DotEnvironment } from '../../../shared/models/dot-environment/dot-environment';
import { AjaxActionResponseView } from '../../../shared/models/ajax-action-response/ajax-action-response';
import * as moment from 'moment';
import { DotUser } from '../../../shared/models/dot-user/dot-user';

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
     * @returns {Observable<DotEnvironment[]>}
     * @memberof PushPublishService
     */
    getEnvironments(): Observable<DotEnvironment[]> {
        return this.getCurrentUser().mergeMap(user => {
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
     * @returns {Observable<DotUser>}
     * @memberof PushPublishService
     */
    getCurrentUser(): Observable<DotUser> {
        return this.coreWebService.request({
            method: RequestMethod.Get,
            url: this.currentUsersUrl
        });
    }

    private getPublishEnvironmentData(contentTypeId: string, formValue: any): string {
        let result = '';
        result += `assetIdentifier=${contentTypeId}`;
        result += `&remotePublishDate=${formValue.publishdate || moment(new Date).format('YYYY-MM-DD')}`;
        result += `&remotePublishTime=${formValue.publishdatetime || moment(new Date).format('h:mm')}`;
        result += `&remotePublishExpireDate=${formValue.expiredate || moment(new Date).format('YYYY-MM-DD')}`;
        result += `&remotePublishExpireTime=${formValue.expiredatetime || moment(new Date).format('h:mm')}`;
        result += `&iWantTo=${formValue.pushActionSelected}`;
        result += `&whoToSend=${formValue.environment}`;
        result += '&bundleName=';
        result += '&bundleSelect=';
        result += `&forcePush=${formValue.forcePush}`;
        return result;
    }
}
