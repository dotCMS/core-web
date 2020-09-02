import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { pluck, take } from 'rxjs/operators';
import { CoreWebService } from 'dotcms-js';
import { DotCMSContentlet } from 'dotcms-models';

interface DotActionRequestOptions {
    contentType: string;
    data: { [key: string]: any };
    action: ActionToFire;
}

export  interface DotActionBulkRequestOptions {
    workflowActionId: string;
    contentletIds?: string[];
    query?: string;
    additionalParams: {
        assignComment: {
            comment: string;
            assign: string;
        };
        pushPublish: {
            whereToSend: string;
            iWantTo: string;
            expireDate: string;
            expireTime: string;
            publishDate: string;
            publishTime: string;
            filterKey: string;
        };
    };
}

/* data['whereToSend'] = data.environment.join();
        data['iWantTo'] = data.pushActionSelected;
        data['publishTime'] = moment(data.publishDate).format('HH-mm');
        data['publishDate'] = moment(data.publishDate).format('YYYY-MM-DD');
        data['expireTime'] = moment(data.expireDate).format('HH-mm');
        data['expireDate'] = moment(data.expireDate).format('YYYY-MM-DD');*/

enum ActionToFire {
    NEW = 'NEW',
    PUBLISH = 'PUBLISH'
}

@Injectable()
export class DotWorkflowActionsFireService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Fire a workflow action over a contentlet
     *
     * @param {string} inode
     * @param {string} actionId
     * @param {{ [key: string]: string }} data
     * @returns Observable<any> // contentlet
     * @memberof DotWorkflowActionsFireService
     */
    fireTo(
        inode: string,
        actionId: string,
        data?: { [key: string]: string }
    ): Observable<DotCMSContentlet> {
        return this.coreWebService
            .requestView({
                body: data,
                method: RequestMethod.Put,
                url: `v1/workflow/actions/${actionId}/fire?inode=${inode}`
            })
            .pipe(pluck('entity'));
    }

    bulkFire( data: DotActionBulkRequestOptions ): Observable<DotCMSContentlet> {
        return this.coreWebService
            .requestView({
                body: data,
                method: RequestMethod.Put,
                url: `/api/v1/workflow/contentlet/actions/bulk/fire`
            })
            .pipe(pluck('entity'));
    }

    /**
     * Fire a "NEW" action over the content type received with the specified data
     *
     * @param {contentType} string
     * @param {[key: string]: any} data
     * @returns Observable<T>
     *
     * @memberof DotWorkflowActionsFireService
     */
    newContentlet<T>(contentType: string, data: { [key: string]: any }): Observable<T> {
        return this.request<T>({ contentType, data, action: ActionToFire.NEW });
    }

    /**
     * Fire a "PUBLISH" action over the content type received with the specified data
     *
     * @template T
     * @param {string} contentType
     * @param {{ [key: string]: any }} data
     * @returns {Observable<T>}
     * @memberof DotWorkflowActionsFireService
     */
    publishContentlet<T>(contentType: string, data: { [key: string]: any }): Observable<T> {
        return this.request<T>({
            contentType,
            data,
            action: ActionToFire.PUBLISH
        });
    }

    /**
     * Fire a "PUBLISH" action over the content type received and append the wait for index attr
     *
     * @template T
     * @param {string} contentType
     * @param {{ [key: string]: any }} data
     * @returns {Observable<T>}
     * @memberof DotWorkflowActionsFireService
     */
    publishContentletAndWaitForIndex<T>(
        contentType: string,
        data: { [key: string]: any }
    ): Observable<T> {
        return this.publishContentlet(contentType, {
            ...data,
            ...{ indexPolicy: 'WAIT_FOR' }
        });
    }

    private request<T>({ contentType, data, action }: DotActionRequestOptions): Observable<T> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `v1/workflow/actions/default/fire/${action}`,
                body: { contentlet: { contentType: contentType, ...data } }
            })
            .pipe(take(1), pluck('entity'));
    }
}
