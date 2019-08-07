import { mergeMap } from 'rxjs/operators';
import { DotWorkflowService } from '@services/dot-workflow/dot-workflow.service';
import { Observable } from 'rxjs';
import { DotWorkflow } from 'dotcms-models';
import { Component, OnInit, forwardRef } from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';
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
    options$: Observable<DotWorkflow[]>;
    value: DotWorkflow[] = [];
    disabled = false;

    constructor(
        private dotWorkflowService: DotWorkflowService,
        public dotMessageService: DotMessageService
    ) {}

    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     * @param any fn
     * @memberof SearchableDropdownComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    ngOnInit() {
        this.options$ = this.dotMessageService
            .getMessages(['dot.common.select.workflows', 'dot.common.archived'])
            .pipe(mergeMap(() => this.dotWorkflowService.get()));
    }

    /**
     * Update value on change of the multiselect
     *
     * @param string[] value
     * @memberof DotWorkflowsSelectorFieldComponent
     */
    handleChange(value: DotWorkflow[]): void {
        this.propagateChange(value);
    }

    /**
     * Set disable state.
     *
     * @param boolean isDisabled
     * @memberof DotWorkflowsSelectorFieldComponent
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Write a new value to the element
     * @param * value
     * @memberof SearchableDropdownComponent
     */
    writeValue(value: DotWorkflow[]): void {
        this.value = value;
    }
}
