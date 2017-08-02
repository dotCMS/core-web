import { Component, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FieldService, FieldDragDropService } from '../service';
import { FieldRow, Field, FieldColumn, TAB_DIVIDER, LINE_DIVIDER } from '../';
import { ContentTypeFieldsPropertiesFormComponent } from '../content-type-fields-properties-form/index';

/**
 * Display all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'content-type-fields-drop-zone',
    styles: [require('./content-type-fields-drop-zone.component.scss')],
    templateUrl: './content-type-fields-drop-zone.component.html',
})
export class ContentTypeFieldsDropZoneComponent {
    displayDialog: boolean;
    fieldRows: FieldRow[] = [];
    formData: Field;
    @Input() fields: Field[];
    @Output('saveFields') saveFieldsEvent = new EventEmitter<Field[]>();

    constructor(private fieldDragDropService: FieldDragDropService) {

    }

    ngOnInit(): void {
        this.fieldDragDropService.fieldDrop$.subscribe((data) => {
            let dragType = data[0];

            if (dragType === 'fields-bag') {
                this.setDroppedField();
                this.showDialog();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fields.currentValue) {
            let fields = changes.fields.currentValue;

            if (Array.isArray(fields)) {
                this.fieldRows = this.getRowFields(fields);
            } else {
                throw 'Fields attribute must be a Array';
            }
        }
    }

    /**
     * Emit the saveField event
     * @param {Field} fieldToSave
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    saveFields(fieldToSave: Field): void {
        let fields = this.getFields();
        // Needs a better implementation
        fields.map(field => {
            if (!field.id && !(fieldToSave.clazz === TAB_DIVIDER.clazz || fieldToSave.clazz === LINE_DIVIDER.clazz)) {
                field = Object.assign(field, fieldToSave);
            } else if (field.id === this.formData.id) {
                field = Object.assign(field, fieldToSave);
            }

            return field;
        });

        this.saveFieldsEvent.emit(fields);
        this.cancelDialog();
    }

    /**
     * Get the field to be edited
     * @param {Field} fieldToEdit
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    editField(fieldToEdit: Field): void {
        let fields = this.getFields();
        // Needs a better implementation
        fields.map((field) => {
            if (fieldToEdit.id === field.id) {
                this.formData = fieldToEdit;
            }

            return field;
        });

        this.showDialog();
    }

    /**
     * Set the field to be edited
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    setDroppedField(): void {
        let fields = this.getFields();
        // Needs a better implementation
        fields.map(field => {
            if (!field.id && !(field.clazz === TAB_DIVIDER.clazz || field.clazz === LINE_DIVIDER.clazz)) {
                this.formData = field;
            }
        });
    }

    /**
     * Show the properties field dialog
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    showDialog(): void {
        this.displayDialog = true;
    }

    /**
     * Close the properties field dialog
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    cancelDialog(): void {
        this.displayDialog = false;
    }

    /**
     * Remove the last dropped field added without ID
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    removeFieldsWithoutId(): void {
        let fieldRows: any = this.fieldRows;

        fieldRows.forEach((row) => {
            row.columns.forEach((col, colIndex) => {
                col.fields.forEach((field, fieldIndex) => {
                    if (!field.id) {
                        row.columns[colIndex].fields.splice(fieldIndex, 1);
                    }
                });
            });
        });

        this.cancelDialog();
    }

    /**
     * Split the fields by line divider if is necessary
     * @private
     * @param {Field[]} fields
     * @returns {Field[][]}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    private splitFieldsByLineDiveder(fields: Field[]): Field[][] {
        let result: Field[][] = [];
        let currentFields: Field[];
        fields.forEach(field => {
            if (field.clazz === LINE_DIVIDER.clazz) {
                currentFields = [];
                result.push(currentFields);
            }
            currentFields.push(field);
        });

        return result;
    }

    /**
     * Get the rows with the fields
     * @private
     * @param {Field[]} fields
     * @returns {FieldRow[]}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    private getRowFields(fields: Field[]): FieldRow[] {
        let fieldRows: FieldRow[] = [];
        let splitFields: Field[][] = this.splitFieldsByLineDiveder(fields);

        fieldRows = splitFields.map(fields => {
            let fieldRow: FieldRow = new FieldRow();
            fieldRow.addFields(fields);
            return fieldRow;
        });

        return fieldRows;
    }

    /**
     * Get all fields
     * @private
     * @returns {Field[]}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    private getFields(): Field[] {

        let fields: Field[] = [];

        this.fieldRows.forEach((fieldRow, rowIndex) => {
            fields.push(fieldRow.lineDivider);

            fieldRow.columns.forEach( (fieldColumn, colIndex) => {
                fields.push(fieldColumn.tabDivider);

                fieldColumn.fields.forEach( field => fields.push(field));
            });
        });

        return fields;
    }
}