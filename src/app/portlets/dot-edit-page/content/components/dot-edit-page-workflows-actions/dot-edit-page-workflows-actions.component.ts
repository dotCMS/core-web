import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Workflow } from '../../../../../shared/models/workflow/workflow.model';
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
            .map((workflows: Workflow[]) => this.getWorkflowOptions(workflows));
    }

    private getWorkflowOptions(workflows: Workflow[]): MenuItem[] {
        return workflows.map((workflow: Workflow) => {
            return {
                label: workflow.name
            };
        });
    }
}
