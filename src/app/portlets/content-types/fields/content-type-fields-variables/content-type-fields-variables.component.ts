import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { FieldVariablesService } from '../service/';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DotHttpErrorManagerService } from '../../../../api/services/dot-http-error-manager/dot-http-error-manager.service';
import { ResponseView } from 'dotcms-js/dotcms-js';

export interface FieldVariable {
    id?: string;
    clazz?: string;
    fieldId?: string;
    key: string;
    value: string;
}

@Component({
    selector: 'dot-content-type-fields-variables',
    styleUrls: ['./content-type-fields-variables.component.scss'],
    templateUrl: './content-type-fields-variables.component.html'
})
export class ContentTypeFieldsVariablesComponent implements OnInit, OnChanges {
    @Input() contentTypeId: string;
    @Input() field: {
        id?: string,
        typeId?: string
    } = {};

    fieldVariables: FieldVariable[] = [];
    messages: {[key: string]: string} = {};
    form: FormGroup;

    constructor(
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        public dotMessageService: DotMessageService,
        private fieldVariablesService: FieldVariablesService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'contenttypes.field.variables.key_header.label',
                'contenttypes.field.variables.value_header.label',
                'contenttypes.field.variables.key_placeholder.label',
                'contenttypes.field.variables.value_placeholder.label',
                'contenttypes.field.variables.actions_header.label',
                'contenttypes.field.variables.value_no_rows.label'
            ])
            .subscribe((messages: {[key: string]: string}) => {
                this.messages = messages;
                this.initTableData();
            });
        this.form = this.fb.group({
            key: '',
            value: ''
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.field.currentValue && !changes.field.firstChange) {
            this.initTableData();
        }
    }

    /**
     * Handle Create Variable event from form
     * @memberof ContentTypeFieldsVariablesComponent
     */
    addVariableForm(): void {
        const variable: FieldVariable = {
            key: this.form.controls.key.value,
            value: this.form.controls.value.value
        };
        this.saveVariable(variable);
        this.form.setValue({ key: '', value: '' });
    }

    /**
     * Handle Delete event
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    deleteVariable(fieldIndex: number): void {
        this.fieldVariablesService.deleteFieldVariables(this.field.typeId, this.field.id, this.fieldVariables[fieldIndex].id)
            .subscribe(() => {
                this.fieldVariables = this.fieldVariables.filter((item: FieldVariable, index: number) => index !== fieldIndex);
            }, (err: ResponseView) => {
                this.dotHttpErrorManagerService.handle(err).subscribe();
            });
    }

    /**
     * Handle Save event
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    saveVariable(variable: FieldVariable, variableIndex?: number): void {
        this.fieldVariablesService.saveFieldVariables(this.field.typeId, this.field.id, variable)
            .subscribe((savedVariable: FieldVariable) => {
                if (typeof variableIndex !== 'undefined') {
                    this.fieldVariables = this.updateVariableCollection(savedVariable, variableIndex);
                } else {
                    this.fieldVariables = this.fieldVariables.concat(savedVariable);
                }
            }, (err: ResponseView) => {
                this.dotHttpErrorManagerService.handle(err).subscribe();
            });
    }

    /**
     * Checks if a existing variable meets conditions to be updated
     * @param {number} index
     * @returns {boolean}
     * @memberof ContentTypeFieldsVariablesComponent
     */
    shouldBeDisabled(index: number): boolean {
        return this.fieldVariables[index].key === '' || this.fieldVariables[index].value === '';
    }

    private initTableData(): void {
        this.fieldVariablesService.loadFieldVariables(this.field.typeId, this.field.id).subscribe((fieldVariables: FieldVariable[]) => {
            this.fieldVariables = fieldVariables;
        });
    }

    private updateVariableCollection(savedVariable: FieldVariable, variableIndex?: number): FieldVariable[] {
        return this.fieldVariables.map((item, index) => {
            if (index === variableIndex) {
                item = savedVariable;
            }
            return item;
        });
    }

}
