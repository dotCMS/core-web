import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotCMSWorkflowAction, DotCMSWorkflow } from 'dotcms-models';
import { DotWizardStep } from '@models/dot-wizard-step/dot-wizard-step.model';
import { DotAssigneeFormComponent } from '@components/_common/forms/dot-assignee-form/dot-assignee-form.component';
import { DotCommentFormComponent } from '@components/_common/forms/dot-comment-form/dot-comment-form.component';
import { DotPushPublishFormComponent } from '@components/_common/forms/dot-push-publish-form/dot-push-publish-form.component';
import { DotCMSWorkflowInput } from '../../../../../projects/dotcms-models/src/dot-workflow-action';

@Injectable()
export class DotWorkflowsActionsService {
    private workflowStepMap = {
        assignable: DotAssigneeFormComponent,
        commentable: DotCommentFormComponent,
        pushPublish: DotPushPublishFormComponent
    };

    constructor(private coreWebService: CoreWebService) {}

    /**
     * Return a list of actions based on the workflows received
     *
     * @param {DotCMSWorkflow[]} [workflows=[]]
     * @returns {Observable<DotCMSWorkflowAction[]>}
     * @memberof DotWorkflowsActionsService
     */
    getByWorkflows(workflows: DotCMSWorkflow[] = []): Observable<DotCMSWorkflowAction[]> {
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
     * @returns {Observable<DotCMSWorkflowAction[]>}
     * @memberof DotWorkflowsActionsService
     */
    getByInode(inode: string): Observable<DotCMSWorkflowAction[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/workflow/contentlet/${inode}/actions`
            })
            .pipe(pluck('entity'));
    }

    setWizardSteps(workflow: DotCMSWorkflowAction): DotWizardStep[] {
        const steps: DotWizardStep[] = [];
        workflow.actionInputs.forEach((input: DotCMSWorkflowInput) => {
            if (this.workflowStepMap[input.id]) {
                steps.push({
                    component: this.workflowStepMap[input.id],
                    data: input.id === 'assignable' ? this.getAssignableData(workflow) : {}
                });
            }
        });
        return steps;
    }

    private getWorkFlowId(workflow: DotCMSWorkflow): string {
        return workflow && workflow.id;
    }

    private getAssignableData(workflow: DotCMSWorkflowAction): { [key: string]: string } {
        return { roleId: workflow.nextAssign };
    }
}
