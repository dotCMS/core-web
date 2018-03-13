import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { WorkflowActions } from '../../../shared/models/workflow-actions/workflow-actions.model';

/**
 * Provide util methods to get Workflows.
 * @export
 * @class WorkflowService
 */
@Injectable()
export class WorkflowService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Method to get Workflows
     * @param {string} id
     * @returns {Observable<SelectItem[]>}
     * @memberof WorkflowService
     */
    get(): Observable<WorkflowActions[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'v1/workflow/schemes'
            })
            .pluck('entity');
    }

    /**
     * Returns the wokflow or workflow actions for a page asset
     *
     * @param {string} inode
     * @returns {Observable<Workflow[]>}
     * @memberof WorkflowService
     */
    getPageWorkflows(inode: string): Observable<WorkflowActions[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/workflow/contentlet/${inode}/actions`
            })
            .pluck('entity');
    }
}
