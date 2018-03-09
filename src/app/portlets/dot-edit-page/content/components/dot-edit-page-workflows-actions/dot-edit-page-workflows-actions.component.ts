import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Workflow } from '../../../../../shared/models/workflow/workflow.model';
import { WorkflowService } from '../../../../../api/services/workflow/workflow.service';

@Component({
    selector: 'dot-edit-page-workflows-actions',
    templateUrl: './dot-edit-page-workflows-actions.component.html'
})
export class DotEditPageWorkflowsActionsComponent implements OnInit {
    @Input() inode: string;
    @Input() label: string;

    pageWorkflows: Workflow[];
    workflowsActions: MenuItem[] = [];

    constructor(private workflowsService: WorkflowService) {}

    ngOnInit() {
        this.workflowsService.getPageWorkflows(this.inode).subscribe((data) => {
            this.pageWorkflows = data;
            this.workflowsActions = this.getWorkflowOptions();
        });
    }

    private getWorkflowOptions(): MenuItem[] {
        return this.pageWorkflows.map((workflow: Workflow) => {
            return {
                label: workflow.name
            };
        });
    }
}
