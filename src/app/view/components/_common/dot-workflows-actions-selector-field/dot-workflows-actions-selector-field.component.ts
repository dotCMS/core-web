import { Component, Input, OnChanges, SimpleChanges, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectItemGroup, SelectItem } from 'primeng/primeng';

import { DotWorkflowAction } from '@shared/models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflowsActionsService } from '@services/dot-workflows-actions/dot-workflows-actions.service';
import { DotMessageService } from '@services/dot-messages-service';
import { DotWorkflow } from '@shared/models/dot-workflow/dot-workflow.model';

interface DropdownEvent {
    originalEvent: MouseEvent;
    value: DotWorkflowAction;
}

@Component({
    selector: 'dot-workflows-actions-selector-field',
    templateUrl: './dot-workflows-actions-selector-field.component.html',
    styleUrls: ['./dot-workflows-actions-selector-field.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotWorkflowsActionsSelectorFieldComponent)
        }
    ]
})
export class DotWorkflowsActionsSelectorFieldComponent
    implements ControlValueAccessor, OnChanges, OnInit {
    @Input() workflows: DotWorkflow[];

    actions$: Observable<SelectItemGroup[]>;
    disabled = false;
    placeholder$: Observable<string>;
    value: string;

    constructor(
        private dotWorkflowsActionService: DotWorkflowsActionsService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.placeholder$ = this.getPlaceholder();
        this.actions$ = this.getActionsGroupedByWorkflows();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.dotWorkflowsActionService.loadByWorkflows(changes.workflows.currentValue);
    }

    /**
     * Update value on change of the multiselect
     *
     * @param {DropdownEvent} { value }
     * @memberof DotWorkflowsActionsSelectorFieldComponent
     */
    handleChange({ value }: DropdownEvent): void {
        this.propagateChange(value || '');
    }

    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param {*} fn
     * @memberof DotWorkflowsActionsSelectorFieldComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    /**
     * Set disable state.
     *
     * @param {boolean} value
     * @memberof DotWorkflowsActionsSelectorFieldComponent
     */
    setDisabledState(value: boolean): void {
        this.disabled = value;
    }

    /**
     * Write a new value to the element
     *
     * @param {string} value
     * @memberof DotWorkflowsActionsSelectorFieldComponent
     */
    writeValue(value: string): void {
        if (value) {
            this.value = value;
        }
    }

    private getActionsByWorkflowId(
        { id }: DotWorkflow,
        actions: DotWorkflowAction[]
    ): DotWorkflowAction[] {
        return actions.filter((action: DotWorkflowAction) => action.schemeId === id);
    }

    private getActionsGroupedByWorkflows(): Observable<SelectItemGroup[]> {
        return this.dotWorkflowsActionService
            .getByWorkflows()
            .pipe(map(this.getSelectItemGroups.bind(this)));
    }

    private getPlaceholder(): Observable<string> {
        return this.dotMessageService
            .getMessages(['contenttypes.selector.workflow.action'])
            .pipe(
                map(
                    (message: { [key: string]: string }) =>
                        message['contenttypes.selector.workflow.action']
                )
            );
    }

    private getSelectItem({ name, id }: DotWorkflowAction | DotWorkflow): SelectItem {
        return {
            label: name,
            value: id
        };
    }

    private getSelectItemGroups(actions: DotWorkflowAction[]): SelectItemGroup[] {
        return this.workflows.map((workflow: DotWorkflow) => {
            const { label, value } = this.getSelectItem(workflow);

            return {
                label,
                value,
                items: this.getActionsByWorkflowId(workflow, actions).map(this.getSelectItem)
            };
        });
    }
}
