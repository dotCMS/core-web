import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotWorkflowAction } from '@shared/models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflow } from '@shared/models/dot-workflow/dot-workflow.model';

@Injectable()
export class DotWorkflowsActionsService {
    private data$: Subject<DotWorkflowAction[]> = new Subject();

    constructor(private coreWebService: CoreWebService) {}

    /**
     * Load and update actions
     *
     * @param {string[]} workflows
     * @memberof DotWorkflowsActionsService
     */
    loadByWorkflows(workflows: DotWorkflow[]): void {
        if (workflows && workflows.length) {
            this.coreWebService
                .requestView({
                    method: RequestMethod.Post,
                    url: '/api/v1/workflow/schemes/actions/NEW',
                    body: {
                        schemes: workflows.map(this.getWorkFlowId)
                    }
                })
                .pipe(
                    take(1),
                    pluck('entity')
                )
                .subscribe((actions: DotWorkflowAction[]) => {
                    this.data$.next(actions);
                });
        } else {
            this.data$.next([]);
        }
    }

    /**
     * Return the actions loaded by workflows
     *
     * @returns {Observable<DotWorkflowAction[]>}
     * @memberof DotWorkflowsActionsService
     */
    getByWorkflows(): Observable<DotWorkflowAction[]> {
        return this.data$.asObservable();
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
