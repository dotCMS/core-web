import { BaseComponent } from '../../../../view/components/_common/_base/base-component';
import {
    Component,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    ViewChild
} from '@angular/core';
import { FieldService, FieldDragDropService } from '../service';
import { FieldRow, Field, FieldColumn, TAB_DIVIDER, LINE_DIVIDER } from '../shared';
import { ContentTypeFieldsPropertiesFormComponent } from '../content-type-fields-properties-form';
import { MessageService } from '../../../../api/services/messages-service';

/**
 * Display all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'content-type-fields-drop-zone',
    styleUrls: ['./content-type-fields-drop-zone.component.scss'],
    templateUrl: './content-type-fields-drop-zone.component.html',
})
export class ContentTypeFieldsDropZoneComponent extends BaseComponent implements OnInit, OnChanges {
    displayDialog = false;
    fieldRows: FieldRow[] = [];
    formData: Field;
    fieldProperties: string[];

    @ViewChild('fieldPropertiesForm') propertiesForm: ContentTypeFieldsPropertiesFormComponent;

    @Input() fields: Field[];
    @Output() saveFields = new EventEmitter<Field[]>();

    constructor(private fieldDragDropService: FieldDragDropService, messageService: MessageService) {
        super(
            [
                'Save',
                'Cancel',
                'edit',
                'Create-field',
                'contenttypes.dropzone.empty.message'
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.fieldDragDropService.fieldDrop$.subscribe((data) => {
            const dragType = data[0];

            if (dragType === 'fields-bag') {
                this.setDroppedField();
                this.toggleDialog();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fields.currentValue) {
            const fields = changes.fields.currentValue;

            if (Array.isArray(fields)) {
                this.fieldRows = this.getRowFields(fields);
            } else {
                throw new Error('Fields attribute must be a Array');
            }
        }
    }

    /**
     * Emit the saveField event
     * @param {Field} fieldToSave
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    saveFieldsHandler(fieldToSave: Field): void {
        const fields = this.getFields();
        console.log('saveFieldsHandler', fields);
        // Needs a better implementation
        fields.map(field => {
            console.log('saveFieldsHandler', field, this.isNewField(field));
            if (this.isNewField(field)) {
                field = Object.assign(field, fieldToSave);
            } else if (field.id === this.formData.id) {
                field = field;
            }
            return field;
        });
        console.log('emit saveFields');
        this.saveFields.emit(fields);
        this.toggleDialog();
    }

    /**
     * Get the field to be edited
     * @param {Field} fieldToEdit
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    editField(fieldToEdit: Field): void {
        const fields = this.getFields();
        // Needs a better implementation

        fields.forEach((field) => {
            if (fieldToEdit.id === field.id) {
                this.formData = fieldToEdit;
            }
        });

        this.toggleDialog();
    }

    /**
     * Set the field to be edited
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    setDroppedField(): void {
        const fields = this.getFields();
        // Needs a better implementation
        fields.forEach(field => {
            if (this.isNewField(field)) {
                this.formData = field;
                console.log('set drop field: ', field);
            }
        });
    }

    /**
     * Show or hide dialog
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    toggleDialog(): void {
        this.displayDialog = !this.displayDialog;
    }

    /**
     * Remove the last dropped field added without ID
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    removeFieldsWithoutId(): void {
        const fieldRows: any = this.fieldRows;
        // TODO needs an improvement for performance reasons
        fieldRows.forEach((row) => {
            row.columns.forEach((col, colIndex) => {
                col.fields.forEach((field, fieldIndex) => {
                    if (!field.id) {
                        row.columns[colIndex].fields.splice(fieldIndex, 1);
                    }
                });
            });
        });

        this.propertiesForm.destroy();
    }

    /**
     * Verify if the Field already exist
     * @param {Field} field
     * @returns {Boolean}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    isNewField(field: Field): Boolean {
        return !field.id && !(this.isRow(field) || this.isColumn(field));
    }

    /**
     * Verify if the Field is a row
     * @param {Field} field
     * @returns {Boolean}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    isRow(field: Field): Boolean {
        return field.clazz === LINE_DIVIDER.clazz ? true : false;
    }

    /**
     * Verify if the Field is a column
     * @param {Field} field
     * @returns {Boolean}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    isColumn(field: Field): Boolean {
        return field.clazz === TAB_DIVIDER.clazz ? true : false;
    }

    private splitFieldsByLineDiveder(fields: Field[]): Field[][] {
        console.log('fields', fields);
        const result: Field[][] = [];
        let currentFields: Field[];

        fields.forEach(field => {
            if (field.clazz === LINE_DIVIDER.clazz) {
                currentFields = [];
                result.push(currentFields);
            }

            // TODO: this code is for avoid error in edit mode, but I dont know if this it's the bets fix
            if (!currentFields) {
                currentFields = [];
                result.push(currentFields);
            }

            currentFields.push(field);
        });

        return result;
    }

    private getRowFields(fields: Field[]): FieldRow[] {
        let fieldRows: FieldRow[] = [];
        const splitFields: Field[][] = this.splitFieldsByLineDiveder(fields);

        fieldRows = splitFields.map(fieldsByLineDivider => {
            const fieldRow: FieldRow = new FieldRow();
            fieldRow.addFields(fieldsByLineDivider);
            return fieldRow;
        });

        return fieldRows;
    }

    private getFields(): Field[] {

        const fields: Field[] = [];

        this.fieldRows.forEach((fieldRow, rowIndex) => {
            fields.push(fieldRow.lineDivider);

            fieldRow.columns.forEach((fieldColumn, colIndex) => {
                fields.push(fieldColumn.tabDivider);
                fieldColumn.fields.forEach(field => fields.push(field));
            });
        });

        return fields;
    }
}
