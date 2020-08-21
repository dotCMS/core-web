import { Injectable } from '@angular/core';
import { DotCMSWorkflowActionEvent } from '../../../../../projects/dotcms-models/src/dot-workflow-action';
import { catchError, take } from 'rxjs/operators';
import { DotMessageSeverity, DotMessageType } from '@components/dot-message-display/model';
import { DotCMSWorkflowAction, DotCMSWorkflowInput } from 'dotcms-models';
import { PushPublishService } from '@services/push-publish/push-publish.service';
import { DotMessageDisplayService } from '@components/dot-message-display/services';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotWizardService } from '@services/dot-wizard/dot-wizard.service';
import { DotWizardInput } from '@models/dot-wizard-input/dot-wizard-input.model';
import { DotWizardStep } from '@models/dot-wizard-step/dot-wizard-step.model';
import { DotIframeService } from '@components/_common/iframe/service/dot-iframe/dot-iframe.service';
import * as moment from 'moment';
import { DotCommentAndAssignFormComponent } from '@components/_common/forms/dot-comment-and-assign-form/dot-comment-and-assign-form.component';
import { DotPushPublishFormComponent } from '@components/_common/forms/dot-push-publish-form/dot-push-publish-form.component';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { DotWorkflowActionsFireService } from '@services/dot-workflow-actions-fire/dot-workflow-actions-fire.service';
import { DotGlobalMessageService } from '@components/_common/dot-global-message/dot-global-message.service';

enum DotActionInputs {
    ASSIGNABLE = 'assignable',
    COMMENTABLE = 'commentable',
    COMMENTANDASSIGN = 'commentAndAssign'
}

@Injectable({
    providedIn: 'root'
})
export class DotWorkflowEventHandlerService {
    private workflowStepMap = {
        commentAndAssign: DotCommentAndAssignFormComponent,
        pushPublish: DotPushPublishFormComponent
    };

    constructor(
        private pushPublishService: PushPublishService,
        private dotMessageDisplayService: DotMessageDisplayService,
        private dotMessageService: DotMessageService,
        private dotWizardService: DotWizardService,
        private dotIframeService: DotIframeService,
        private httpErrorManagerService: DotHttpErrorManagerService,
        private dotWorkflowActionsFireService: DotWorkflowActionsFireService,
        private dotGlobalMessageService: DotGlobalMessageService
    ) {}

    open(event: DotCMSWorkflowActionEvent): void {
        if (this.containsPushPublish(event.workflow.actionInputs)) {
            this.pushPublishService
                .getEnvironments()
                .pipe(take(1))
                .subscribe(environments => {
                    if (environments.length) {
                        this.openWizard(event);
                    } else {
                        this.dotMessageDisplayService.push({
                            life: 3000,
                            message: this.dotMessageService.get(
                                'editpage.actions.fire.error.add.environment'
                            ),
                            severity: DotMessageSeverity.ERROR,
                            type: DotMessageType.SIMPLE_MESSAGE
                        });
                    }
                });
        } else {
            this.openWizard(event);
        }
    }

    containsPushPublish(inputs: DotCMSWorkflowInput[]): boolean {
        return inputs.some(input => input.id === 'pushPublish');
    }

    setWizardInput(workflow: DotCMSWorkflowAction, title: string): DotWizardInput {
        const steps: DotWizardStep<any>[] = [];
        this.mergeCommentAndAssign(workflow).forEach((input: DotCMSWorkflowInput) => {
            if (this.workflowStepMap[input.id]) {
                steps.push({
                    component: this.workflowStepMap[input.id],
                    data: input.body
                });
            }
        });
        return steps.length
            ? {
                  title: title,
                  steps: steps
              }
            : null;
    }

    processWorkflowPayload(
        data: { [key: string]: any },
        inputs: DotCMSWorkflowInput[]
    ): { [key: string]: any } {
        if (this.containsPushPublish(inputs)) {
            data['whereToSend'] = data.environment.join();
            data['iWantTo'] = data.pushActionSelected;
            data['publishTime'] = moment(data.publishDate).format('HH-mm');
            data['publishDate'] = moment(data.publishDate).format('YYYY-MM-DD');
            data['expireTime'] = moment(data.expireDate).format('HH-mm');
            data['expireDate'] = moment(data.expireDate).format('YYYY-MM-DD');
            delete data.environment;
            delete data.pushActionSelected;
        }
        return data;
    }

    private mergeCommentAndAssign(workflow: DotCMSWorkflowAction): DotCMSWorkflowInput[] {
        const body = {};
        let workflows: DotCMSWorkflowInput[];
        workflow.actionInputs.forEach(input => {
            if (this.isCommentOrAssign(input.id)) {
                body[input.id] = true;
            }
        });
        if (Object.keys(body).length) {
            workflows = workflow.actionInputs.filter(input => !this.isCommentOrAssign(input.id));
            workflows.unshift({
                id: DotActionInputs.COMMENTANDASSIGN,
                body: { ...body, ...this.getAssignableData(workflow) }
            });
        } else {
            return workflow.actionInputs;
        }
        return workflows;
    }

    private openWizard(event: DotCMSWorkflowActionEvent): void {
        this.dotWizardService
            .open(
                this.setWizardInput(event.workflow, this.dotMessageService.get('Workflow-Action'))
            )
            .pipe(take(1))
            .subscribe((data: { [key: string]: any }) => {
                this.fireWorkflowAction(event, data);
            });
    }

    private fireWorkflowAction(
        event: DotCMSWorkflowActionEvent,
        data?: { [key: string]: any }
    ): void {
        this.dotWorkflowActionsFireService
            .fireTo(
                event.inode,
                event.workflow.id,
                this.processWorkflowPayload(data, event.workflow.actionInputs)
            )
            .pipe(
                catchError(error => {
                    return this.httpErrorManagerService.handle(error);
                }),
                take(1)
            )
            .subscribe(() => {
                debugger;
                this.dotGlobalMessageService.display(
                    this.dotMessageService.get('editpage.actions.fire.confirmation', event.workflow.name)
                );
                this.dotIframeService.run(event.callback);
            });
    }

    private getAssignableData(workflow: DotCMSWorkflowAction): { [key: string]: any } {
        return { roleId: workflow.nextAssign, roleHierarchy: workflow.roleHierarchyForAssign };
    }

    private isCommentOrAssign(id: string): boolean {
        return id === DotActionInputs.ASSIGNABLE || id === DotActionInputs.COMMENTABLE;
    }
}
