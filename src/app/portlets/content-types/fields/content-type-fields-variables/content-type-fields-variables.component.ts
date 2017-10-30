import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../view/components/_common/_base/base-component';
import { MessageService } from '../../../../api/services/messages-service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FieldVariable } from '../shared/field-variables.model';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-content-type-fields-variables',
    styleUrls: ['./content-type-fields-variables.component.scss'],
    templateUrl: './content-type-fields-variables.component.html',
})
export class ContentTypeFieldsVariablesComponent extends BaseComponent implements OnChanges {

    @Input() form: FormGroup;
    @Input() field; Field;

    constructor(messageService: MessageService, private fb: FormBuilder) {
        super([
            'contenttypes.field.variables.key.label',
            'contenttypes.field.variables.value.label',
            'contenttypes.field.variables.key.new',
            'contenttypes.field.variables.value.new',
        ], messageService);
    }

    ngOnChanges(change: SimpleChanges): void {
        if (change.field.currentValue) {
            this.setFieldVariablesControl();
        }
    }

    setFieldVariablesControl(): void {
        const fieldVariablesControl: FormArray = this.fb.array([]);

        this.addNewVariablesRow(fieldVariablesControl);

        if (this.field.fieldVariables) {
            this.field.fieldVariables.forEach(fieldVariable => fieldVariablesControl.push(this.fb.group({
                key: [fieldVariable.key, Validators.required],
                value: [fieldVariable.value, Validators.required]
            })));
        }

        this.form.addControl('fieldVariables', fieldVariablesControl);
    }

    onEditInit(event): void {
        const emptyValue = event.column.field === 'key' ?
            this.i18nMessages['contenttypes.field.variables.key.new'] : this.i18nMessages['contenttypes.field.variables.value.new'];

        if (event.data[event.column.field] === emptyValue) {
            event.data[event.column.field] = '';
        }
    }

    editComplete(index: number, fieldVariable: FieldVariable): void {
        if (index === 0 && !this.isFirstRowNew()) {
            this.addNewVariablesRow(<FormArray> this.form.get('fieldVariables'));
        }

        console.log('fieldVariablesControl.value[0]', this.form.get('fieldVariables'));
    }

    removeEmptyRow(): void {
        if (this.isFirstRowEmpty()) {
            const fieldVariablesControl: FormArray = <FormArray>  this.form.get('fieldVariables');
            fieldVariablesControl.removeAt(0);
        }
    }

    onMessage(): void {
       if (this.form) {
            const fieldVariablesControl: FormArray = <FormArray>  this.form.get('fieldVariables');
            fieldVariablesControl.value[0].key = this.i18nMessages['contenttypes.field.variables.key.new'];
            fieldVariablesControl.value[0].value =  this.i18nMessages['contenttypes.field.variables.value.new'];
        }
    }

    removeFieldVariable(fieldVariable: FieldVariable): void {
        console.log('fieldVariable', fieldVariable);
        const fieldVariablesControl: FormArray = <FormArray>  this.form.get('fieldVariables');
        const fieldVariableIndex = fieldVariablesControl.value.indexOf(fieldVariable);
        console.log('fieldVariableIndex', fieldVariableIndex);
        fieldVariablesControl.value.splice(fieldVariableIndex, 1);
        console.log('fieldVariablesControl.value', fieldVariablesControl.value);
    }

    isFirstRowEmpty(): boolean {
        const fieldVariablesControl: FormArray = <FormArray>  this.form.get('fieldVariables');

        const keyEmptyValue = this.i18nMessages['contenttypes.field.variables.key.new'];
        const valueEmptyValue = this.i18nMessages['contenttypes.field.variables.value.new'];

        return fieldVariablesControl.value[0].key === keyEmptyValue && fieldVariablesControl.value[0].value === valueEmptyValue;
    }

    isFirstRowNew(): boolean {
        const fieldVariablesControl: FormArray = <FormArray>  this.form.get('fieldVariables');

        const keyEmptyValue = this.i18nMessages['contenttypes.field.variables.key.new'];
        const valueEmptyValue = this.i18nMessages['contenttypes.field.variables.value.new'];

        return fieldVariablesControl.value[0].key === keyEmptyValue || fieldVariablesControl.value[0].value === valueEmptyValue;
    }

    private addNewVariablesRow(fieldVariablesControl: FormArray) {
        fieldVariablesControl.insert(0, this.fb.group({
            key: [this.i18nMessages['contenttypes.field.variables.key.new'], Validators.required],
            value: [this.i18nMessages['contenttypes.field.variables.value.new'], Validators.required]
        }));
    }
}

