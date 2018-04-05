import { DotWorkflowService } from './../../../../api/services/dot-workflow/dot-workflow.service';
import { Observable } from 'rxjs/Observable';
import { DotWorkflow } from './../../../../shared/models/dot-workflow/dot-workflow.model';
import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { SelectItem } from 'primeng/components/common/selectitem';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'dot-workflows-selector-field',
    templateUrl: './dot-workflows-selector-field.component.html',
    styleUrls: ['./dot-workflows-selector-field.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotWorkflowsSelectorFieldComponent)
        }
    ]
})
export class DotWorkflowsSelectorFieldComponent implements ControlValueAccessor, OnInit {
    @Input() setDefault;

    options: Observable<SelectItem[]>;
    value: string[];
    disabled = false;

    private workflowsModel: DotWorkflow[];

    constructor(private dotWorkflowService: DotWorkflowService, public dotMessageService: DotMessageService) {}

    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     * @param {any} fn
     * @memberof SearchableDropdownComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    ngOnInit() {
        this.options = this.dotMessageService.getMessages(['dot.common.select.workflows', 'dot.common.archived']).mergeMap(() => {
            return this.dotWorkflowService
                .get()
                .do((workflows: DotWorkflow[]) => {
                    this.workflowsModel = workflows;

                    if (this.setDefault) {
                        this.setDefaultValue(workflows);
                    }
                })
                .flatMap((workflows: DotWorkflow[]) => workflows)
                .map((workflow: DotWorkflow) => this.getWorkflowFieldOption(workflow))
                .toArray();
        });
    }

    /**
     * Update value on change of the multiselect
     *
     * @param {string[]} value
     * @memberof DotWorkflowsSelectorFieldComponent
     */
    handleChange(value: string[]): void {
        this.propagateChange(value);
    }

    /**
     * Check if the item in the template is archived
     *
     * @param {string} id
     * @returns {boolean}
     * @memberof DotWorkflowsSelectorFieldComponent
     */
    isWorkflowArchive(id: string): boolean {
        return this.workflowsModel.filter((workflow: DotWorkflow) => workflow.id === id)[0].archived;
    }

    /**
     * Set disable state.
     *
     * @param {boolean} isDisabled
     * @memberof DotWorkflowsSelectorFieldComponent
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Write a new value to the element
     * @param {*} value
     * @memberof SearchableDropdownComponent
     */
    writeValue(value: string[]): void {
        this.value = value;
    }

    private getDefaultWorkflowValue(workflows: DotWorkflow[]): string[] {
        return workflows.filter((workflow: DotWorkflow) => workflow.defaultScheme).map((workflow: DotWorkflow) => workflow.id);
    }

    private getWorkflowFieldOption(workflow: DotWorkflow): SelectItem {
        return {
            label: workflow.name,
            value: workflow.id
        };
    }

    private setDefaultValue(workflows: DotWorkflow[]) {
        this.value = this.getDefaultWorkflowValue(workflows);
        this.propagateChange(this.value);
    }
}
