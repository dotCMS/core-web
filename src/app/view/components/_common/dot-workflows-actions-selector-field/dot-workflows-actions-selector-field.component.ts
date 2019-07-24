import { Component, Input, OnChanges, SimpleChanges, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';
import { SelectItem } from 'primeng/primeng';

import { DotWorkflowAction } from '@shared/models/dot-workflow-action/dot-workflow-action.model';
import { DotWorkflowsActionsService } from './services/dot-workflows-actions.service';
import { DotMessageService } from '@services/dot-messages-service';

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
    @Input() workflows: string[];

    actions$: Observable<SelectItem[]>;
    disabled = false;
    placeholder$: Observable<string>;
    value: string;

    constructor(
        private dotWorkflowsActionService: DotWorkflowsActionsService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.placeholder$ = this.dotMessageService
            .getMessages(['contenttypes.selector.workflow.action'])
            .pipe(
                map(
                    (message: { [key: string]: string }) =>
                        message['contenttypes.selector.workflow.action']
                )
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        this.actions$ = this.dotWorkflowsActionService.get(changes.workflows.currentValue).pipe(
            flatMap((actions: DotWorkflowAction[]) => actions),
            map(this.getSelectItem),
            toArray()
        );
    }

    /**
     * Update value on change of the multiselect
     *
     * @param {DropdownEvent} { value }
     * @memberof DotWorkflowsActionsSelectorFieldComponent
     */
    handleChange({ value }: DropdownEvent): void {
        this.propagateChange(value);
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
        this.value = value;
    }

    private getSelectItem(action: DotWorkflowAction): SelectItem {
        return {
            label: action.name,
            value: action.id
        };
    }
}
