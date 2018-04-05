import { DotWorkflowService } from './../../../../api/services/dot-workflow/dot-workflow.service';
import { Observable } from 'rxjs/Observable';
import { DotWorkflow } from './../../../../shared/models/dot-workflow/dot-workflow.model';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/components/common/selectitem';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-dot-workflows-selector-field',
    templateUrl: './dot-workflows-selector-field.component.html',
    styleUrls: ['./dot-workflows-selector-field.component.scss']
})
export class DotWorkflowsSelectorFieldComponent implements OnInit {
    options: Observable<SelectItem[]>;

    private workflowsModel: DotWorkflow[];

    constructor(private dotWorkflowService: DotWorkflowService, public dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.options = this.dotMessageService.getMessages(['dot.common.select.workflows', 'dot.common.archived']).mergeMap(() => {
            return this.dotWorkflowService
                .get()
                .do((workflows: DotWorkflow[]) => (this.workflowsModel = workflows))
                .flatMap((workflows: DotWorkflow[]) => workflows)
                .map((workflow: DotWorkflow) => this.getWorkflowFieldOption(workflow))
                .toArray();
        });
    }

    isWorkflowArchive(id: string): boolean {
        return this.workflowsModel.filter((workflow: DotWorkflow) => workflow.id === id)[0].archived;
    }

    private getWorkflowFieldOption(workflow: DotWorkflow): SelectItem {
        return {
            label: workflow.name,
            value: workflow.id
        };
    }
}
