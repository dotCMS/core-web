import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { pluck, take } from 'rxjs/operators';
import { CoreWebService } from 'dotcms-js';

@Injectable()
export class DotWorkflowActionsFireService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Updates the workflow actions for a page asset
     *
     * @param string inode
     * @returns Observable<any> // contentlet
     * @memberof DotWorkflowActionsFireService
     */
    fireWorkflowAction(inode: string, actionId: string): Observable<any> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `v1/workflow/actions/${actionId}/fire?inode=${inode}`
            })
            .pipe(pluck('entity'));
    }

    /**
     * TBD
     * @param content data
     * @returns Content
     *
     * @memberof DotWorkflowActionsFireService
     */
    new<T>(data: any): Observable<T> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `v1/workflow/actions/default/fire/NEW`,
                body: { contentlet: { ...data } }
            })
            .pipe(take(1), pluck('entity'));
    }
}
