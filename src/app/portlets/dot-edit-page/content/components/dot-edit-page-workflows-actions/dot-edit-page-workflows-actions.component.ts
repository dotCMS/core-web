import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { WorkflowActions } from '../../../../../shared/models/workflow-actions/workflow-actions.model';
import { WorkflowService } from '../../../../../api/services/workflow/workflow.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dot-edit-page-workflows-actions',
    templateUrl: './dot-edit-page-workflows-actions.component.html'
})
export class DotEditPageWorkflowsActionsComponent implements OnInit {
    @Input() inode: string;
    @Input() label: string;

    workflowsActions: Observable<MenuItem[]>;

    constructor(private workflowsService: WorkflowService) {}

    ngOnInit() {
        this.workflowsActions = this.workflowsService
            .getPageWorkflows(this.inode)
            .map((workflows: WorkflowActions[]) => this.getWorkflowOptions(workflows));
    }

    private getWorkflowOptions(workflows: WorkflowActions[]): MenuItem[] {
        return workflows.map((workflow: WorkflowActions) => {
            return {
                label: workflow.name
            };
        });
    }
}
