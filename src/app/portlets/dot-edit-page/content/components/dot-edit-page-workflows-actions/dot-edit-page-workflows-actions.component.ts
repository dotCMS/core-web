import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { DotWorkflowAction } from '../../../../../shared/models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflowService } from '../../../../../api/services/dot-workflow/dot-workflow.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dot-edit-page-workflows-actions',
    templateUrl: './dot-edit-page-workflows-actions.component.html',
    styleUrls: ['./dot-edit-page-workflows-actions.component.scss']
})
export class DotEditPageWorkflowsActionsComponent implements OnInit {
    @Input() inode: string;
    @Input() label: string;

    workflowsMenuActions: Observable<MenuItem[]>;

    constructor(private workflowsService: DotWorkflowService) {}

    ngOnInit() {
        this.workflowsMenuActions = this.workflowsService.getContentWorkflowActions(this.inode).map((workflows: DotWorkflowAction[]) => {
            return this.getWorkflowOptions(workflows);
        });
    }

    private getWorkflowOptions(workflows: DotWorkflowAction[]): MenuItem[] {
        return workflows.map((workflow: DotWorkflowAction) => {
            return {
                label: workflow.name,
                command: () => {
                    const request: Observable<any[]> = this.workflowsService.fireWorkflowAction(this.inode, workflow.id);
                    request.subscribe();
                }
            };
        });
    }
}
