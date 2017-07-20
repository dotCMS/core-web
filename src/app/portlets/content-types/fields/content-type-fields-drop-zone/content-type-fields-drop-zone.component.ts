import { Component, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FieldService, FieldDragDropService } from '../service';
import { FieldRow, Field, FieldColumn, TAB_DIVIDER, LINE_DIVIDER } from '../';

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

    fieldRows: FieldRow[] = [];
    @Input() fields: Field[];
    @Output('saveFields') saveFieldsEvent = new EventEmitter<Field[]>();

    constructor(private fieldDragDropService: FieldDragDropService) {

    }

    ngOnInit(): void {
        this.fieldDragDropService.fieldDrop$.subscribe(() => this.saveFields());
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

    saveFields(): void {
        this.saveFieldsEvent.emit(this.getFields());
    }

    private splitFieldsByLineDiveder(fields: Field[]): Field[][] {
        let result: Field[][] = [];
        let currentFields: Field[] = [];

        fields.map(field => {
            if (field.clazz === LINE_DIVIDER.clazz) {
                result.push(currentFields);
                currentFields = [];
            }
            currentFields.push(field);
        });

        if (currentFields.length) {
            result.push(currentFields);
        }

        return result;
    }

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

    private getFields(): Field[] {

        let fields: Field[] = [];

        this.fieldRows.forEach((fieldRow, rowIndex) => {

            if (rowIndex) {
                fields.push(fieldRow.lineDivider);
            }

            fieldRow.columns.forEach( (fieldColumn, colIndex) => {

                if (colIndex) {
                    fields.push(fieldColumn.tabDivider);
                }

                fieldColumn.fields.forEach( field => fields.push(field));
            });
        });

        return fields;
    }
}