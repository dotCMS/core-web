import { toArray, filter, pluck, mergeMap, map } from 'rxjs/operators';
import { CoreWebService, ApiRoot } from 'dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DotEnvironment } from '@models/dot-environment/dot-environment';
import { DotAjaxActionResponseView } from '@models/ajax-action-response/dot-ajax-action-response';
import * as moment from 'moment';
import { DotCurrentUserService } from '../dot-current-user/dot-current-user.service';
import { DotCurrentUser } from '@models/dot-current-user/dot-current-user';
import { DotPushPublishData } from '@models/dot-push-publish-data/dot-push-publish-data';

/**
 * Provide method to push publish to content types
 * @export
 * @class PushPublishService
 */
@Injectable()
export class PushPublishService {
    private pushEnvironementsUrl = 'environment/loadenvironments/roleId';
    private _lastEnvironmentPushed: string[];
    /*
        TODO: I had to do this because this line concat'api/' into the URL
        https://github.com/dotCMS/dotcms-js/blob/master/src/core/core-web.service.ts#L169
    */
    private publishUrl = `${this._apiRoot
        .baseUrl}DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish`;
    private publishBundleURL = `${this._apiRoot
        .baseUrl}DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/pushBundle`;

    constructor(
        public _apiRoot: ApiRoot,
        private coreWebService: CoreWebService,
        private currentUser: DotCurrentUserService
    ) {}

    /**
     * Get push publish environments.
     * @returns Observable<DotEnvironment[]>
     * @memberof PushPublishService
     */
    getEnvironments(): Observable<DotEnvironment[]> {
        return this.currentUser.getCurrentUser().pipe(
            mergeMap((user: DotCurrentUser) => {
                return this.coreWebService.requestView({
                    url: `${this.pushEnvironementsUrl}/${user.roleId}/name=0`
                });
            }),
            pluck('bodyJsonObject'),
            mergeMap((environments: DotEnvironment[]) => environments),
            filter((environment: DotEnvironment) => environment.name !== ''),
            toArray()
        );
    }

    /**
     * Push publish asset to specified environment.
     * @param string contentTypeId
     * @param * formValue
     * @returns Observable<DotAjaxActionResponseView>
     * @memberof PushPublishService
     */
    pushPublishContent(
        assetIdentifier: string,
        pushPublishData: DotPushPublishData,
        isBundle: boolean
    ): Observable<DotAjaxActionResponseView> {
        this._lastEnvironmentPushed = pushPublishData.environment;

        return this.coreWebService.request({
            body: this.getPublishEnvironmentData(assetIdentifier, pushPublishData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: isBundle ? this.publishBundleURL : this.publishUrl
        }).pipe(map((res: any) => <DotAjaxActionResponseView>res));
    }

    private getPublishEnvironmentData(
        assetIdentifier: string,
        { publishDate, expireDate, pushActionSelected, environment, filterKey }: DotPushPublishData
    ): string {
        // TODO: find a way to deal with moment(undefined), since will be deprecated eventually
        let result = '';
        result += `assetIdentifier=${assetIdentifier}`;
        result += `&remotePublishDate=${moment(publishDate).format('YYYY-MM-DD')}`;
        result += `&remotePublishTime=${moment(publishDate).format('HH-mm')}`;
        result += `&remotePublishExpireDate=${moment(expireDate).format('YYYY-MM-DD')}`;
        result += `&remotePublishExpireTime=${moment(expireDate).format('HH-mm')}`;
        result += `&iWantTo=${pushActionSelected}`;
        result += `&whoToSend=${environment}`;
        result += '&bundleName=';
        result += '&bundleSelect=';

        if (filterKey) {
            result += `&filterKey=${filterKey}`;
        }

        return result;
    }

    get lastEnvironmentPushed(): string[] {
        return this._lastEnvironmentPushed;
    }
}
