import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotWorkflowAction, DotWorkflow } from 'dotcms-models';

@Injectable()
export class DotWorkflowsActionsService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Load and update actions
     *
     * @param {string[]} workflows
     * @memberof DotWorkflowsActionsService
     */
    getByWorkflows(workflows: DotWorkflow[]): Observable<DotWorkflowAction[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Post,
                url: '/api/v1/workflow/schemes/actions/NEW',
                body: {
                    schemes: workflows.map(this.getWorkFlowId)
                }
            })
            .pipe(pluck('entity'));
    }

    /**
     * Returns the workflow actions of the passed inode
     *
     * @param {string} inode
     * @returns {Observable<DotWorkflowAction[]>}
     * @memberof DotWorkflowsActionsService
     */
    getByInode(inode: string): Observable<DotWorkflowAction[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/workflow/contentlet/${inode}/actions`
            })
            .pipe(pluck('entity'));
    }

    private getWorkFlowId(workflow: DotWorkflow): string {
        return workflow.id;
    }
}
