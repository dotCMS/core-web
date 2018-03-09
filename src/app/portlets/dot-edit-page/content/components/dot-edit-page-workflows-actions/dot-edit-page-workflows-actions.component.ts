import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Workflow } from '../../../../../shared/models/workflow/workflow.model';
import { WorkflowService } from '../../../../../api/services/workflow/workflow.service';

@Component({
    selector: 'dot-edit-page-workflows-actions',
    templateUrl: './dot-edit-page-workflows-actions.component.html',
})
export class DotEditPageWorkflowsActionsComponent implements OnInit, OnChanges {

    @Input() Inode: string;
    @Input() label: string;

    pageWorkflows: Workflow[];
    workflowsActions: MenuItem[] = [];

    constructor(private workflowsService: WorkflowService) {}

    ngOnInit() {
        this.workflowsService.getPageWorkflows(this.Inode)
            .subscribe((data) => {
                this.pageWorkflows = data;
                this.workflowsActions = this.getWorkflowOptions();
        });
    }

    ngOnChanges(): void {
        // TODO: add behaviour when clicked
    }

    private getWorkflowOptions(): MenuItem[] {
        return this.pageWorkflows.map((workflow: Workflow) => {
            return {
                label: workflow.name
            };
        });
    }

}
