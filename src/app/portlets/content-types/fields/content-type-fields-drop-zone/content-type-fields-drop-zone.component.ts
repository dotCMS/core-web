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
import { FieldRow, Field, FieldColumn } from '../shared';
import { ContentTypeFieldsPropertiesFormComponent } from '../content-type-fields-properties-form';
import { MessageService } from '../../../../api/services/messages-service';
import { FieldUtil } from '../util/field-util';

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
            const source = data[3].dataset.dragType;

            if (dragType === 'fields-bag' && source === 'source') {
                this.setDroppedField();
                this.toggleDialog();
            } else if (source === 'target') {
                this.saveFieldOnMove();
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
        // Needs a better implementation
        fields.map(field => {
            if (FieldUtil.isNewField(field) || (field.id && field.id === this.formData.id)) {
                field = Object.assign(field, fieldToSave);
            }
            return field;
        });
        this.saveFields.emit(fields);
        this.toggleDialog();
    }

    saveFieldOnMove(): void {
        const fields = this.getFields();
        this.saveFields.emit(fields);
    }

    /**
     * Get the field to be edited
     * @param {Field} fieldToEdit
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    editField(fieldToEdit: Field): void {
        const fields = this.getFields();
        this.formData = fields.filter(field => fieldToEdit.id === field.id)[0];
        this.toggleDialog();
    }

    /**
     * Set the field to be edited
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    setDroppedField(): void {
        const fields = this.getFields();
        this.formData = fields.filter(field => FieldUtil.isNewField(field))[0];
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


    private getRowFields(fields: Field[]): FieldRow[] {
        let fieldRows: FieldRow[] = [];
        const splitFields: Field[][] = FieldUtil.splitFieldsByLineDivider(fields);

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
