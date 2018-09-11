import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { BaseComponent } from '../../../../view/components/_common/_base/base-component';
import { FieldVariablesService } from '../service/';

export interface FieldVariable {
    id?: string;
    clazz: string;
    fieldId: string;
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

    constructor(public dotMessageService: DotMessageService, private fieldVariablesService: FieldVariablesService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'contenttypes.field.variables.key_header.label',
                'contenttypes.field.variables.value_header.label',
                'contenttypes.field.variables.key_placeholder.label',
                'contenttypes.field.variables.value_placeholder.label'
            ])
            .subscribe((messages: {[key: string]: string}) => {
                this.messages = messages;
                this.initTableData();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.field.currentValue && !changes.field.firstChange) {
            this.initTableData();
        }
    }

    /**
     * Handle Delete event
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    deleteVariable(variable: FieldVariable): void {
        this.fieldVariablesService.deleteFieldVariables(this.field.typeId, this.field.id, variable.id).subscribe(() => {
            this.fieldVariables = this.fieldVariables.filter((item: FieldVariable) => item !== variable);
        });
    }

    /**
     * Handle Save event
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    saveVariable(variable: FieldVariable): void {
        this.fieldVariablesService.saveFieldVariables(this.field.typeId, this.field.id, variable)
            .subscribe((savedVariable: FieldVariable) => {
                variable = savedVariable;
                this.initTableData();
            });
    }

    /**
     * Handle table input's placeholder when an input has been changed succesfully
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    changeVariable(variable: any): void  {
        this.handlePlaceholderInput(
            variable,
            '',
            '',
            this.messages['contenttypes.field.variables.key_placeholder.label'],
            this.messages['contenttypes.field.variables.value_placeholder.label']);
    }

    /**
     * Handle table input's placeholder when an input get focus
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    changeInitVariable(variable: any): void  {
        this.handlePlaceholderInput(
            variable,
            this.messages['contenttypes.field.variables.key_placeholder.label'],
            this.messages['contenttypes.field.variables.value_placeholder.label'],
            '',
            '');
    }

    /**
     * Handle table input's placeholder when an input lost focus
     * @param {FieldVariable} variable
     * @memberof ContentTypeFieldsVariablesComponent
     */
    changeCancelVariable(variable: any): void  {
        this.handlePlaceholderInput(
            variable,
            '',
            '',
            this.messages['contenttypes.field.variables.key_placeholder.label'],
            this.messages['contenttypes.field.variables.value_placeholder.label']);
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private handlePlaceholderInput(variable: any, compareKey: string, compareValue: string, keyLbl: string, valLbl: string): void {
        variable.data.key = variable.data.key === compareKey && variable.column.field === 'key' ? keyLbl : variable.data.key;
        variable.data.value = variable.data.value === compareValue && variable.column.field === 'value' ? valLbl : variable.data.value;
    }

    private initTableData(): void {
        this.fieldVariablesService.loadFieldVariables(this.field.typeId, this.field.id).subscribe((fieldVariables: FieldVariable[]) => {
            this.fieldVariables = fieldVariables;

            const empty = {
                clazz: '',
                fieldId: '',
                key: this.messages['contenttypes.field.variables.key_placeholder.label'],
                value: this.messages['contenttypes.field.variables.value_placeholder.label']
            };

            this.fieldVariables.push(empty);
        });
    }

}
