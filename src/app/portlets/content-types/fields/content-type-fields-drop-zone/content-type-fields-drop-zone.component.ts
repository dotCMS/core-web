import { Component, SimpleChanges, Input } from '@angular/core';
import { FieldRow, Field, FieldService, FieldColumn } from '../service';

/**
 * Show all the Field Types
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

    private static readonly TAB_DIVIDER: Field = {
        dataType: 'TAB_DIVIDER'
    };

    private static readonly LINE_DIVIDER: Field = {
        dataType: 'LINE_DIVIDER'
    };

    fieldRows: FieldRow[] = [];
    @Input() fields: Field[];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fields.currentValue) {
            this.fieldRows = this.getRowFields(changes.fields.currentValue);
        }
    }

    updateJson(): void {
        let fields: Field[] = this.getFields();
    }

    private getRowFields(fields: Field[]): FieldRow[] {
        let fieldRows: FieldRow[] = [];
        let currentFieldRow: FieldRow = new FieldRow();
        let currentFieldColumn: FieldColumn = {
            fields: []
        };

        fields.forEach(field => {
            if (field.dataType === ContentTypeFieldsDropZoneComponent.TAB_DIVIDER.dataType) {
                currentFieldRow.columns.push(currentFieldColumn);
                currentFieldColumn = {
                    fields: []
                };
            } else if (field.dataType === ContentTypeFieldsDropZoneComponent.LINE_DIVIDER.dataType) {
                currentFieldRow.columns.push(currentFieldColumn);
                currentFieldColumn = {
                    fields: []
                };

                fieldRows.push(currentFieldRow);
                currentFieldRow = new FieldRow();
            } else {
                currentFieldColumn.fields.push(field);
            }
        });

        if (currentFieldColumn.fields.length > 0) {
            currentFieldRow.columns.push(currentFieldColumn);
        }

        if (currentFieldRow.columns.length > 0) {
            fieldRows.push(currentFieldRow);
        }

        return fieldRows;
    }

    private getFields(): Field[] {
        let fields: Field[] = [];

        this.fieldRows.forEach((fieldRow, rowIndex) => {

            if (rowIndex > 0) {
                fields.push(Object.assign({}, ContentTypeFieldsDropZoneComponent.LINE_DIVIDER));
            }

            fieldRow.columns.forEach( (fieldColumn, colIndex) => {

                if (colIndex > 0) {
                    fields.push(Object.assign({}, ContentTypeFieldsDropZoneComponent.TAB_DIVIDER));
                }

                fieldColumn.fields.forEach( field => fields.push(field));
            });
        });

        return fields;
    }
}