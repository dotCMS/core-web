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
    @Output() removeFields = new EventEmitter<Field[]>();

    constructor(private fieldDragDropService: FieldDragDropService, messageService: MessageService) {
        super(
            [
                'contenttypes.dropzone.action.save',
                'contenttypes.dropzone.action.cancel',
                'contenttypes.dropzone.action.edit',
                'contenttypes.dropzone.action.create.field',
                'contenttypes.dropzone.empty.message'
            ],
            messageService
        );
    }

    ngOnInit(): void {
        this.fieldDragDropService.fieldDropFromSource$.subscribe(() => {
            this.setDroppedField();
            this.toggleDialog();
        });

        this.fieldDragDropService.fieldDropFromTarget$.subscribe(() => {
            this.moveFields();
        });

        this.fieldDragDropService.fieldRowDropFromTarget$.subscribe(() => {
            this.moveFields();
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
        const fields = this.getFieldsToSave(fieldToSave);
        this.emitSaveFields(fields);
        this.toggleDialog();
    }

    private moveFields(): void {
        const fields = this.getFields().filter((field, index) => {
            const currentSortOrder = index + 1;

            if (field.sortOrder !== currentSortOrder) {
                field.sortOrder = currentSortOrder;
                return true;
            } else {
                return false;
            }
        });

        this.emitSaveFields(fields);
    }

    private emitSaveFields(fields: Field[]): void {
        this.saveFields.emit(fields);
    }

    private getFieldsToSave(fieldToSave: Field): Field[] {
        if (this.formData.id) {
            return [this.getUpdatedField(fieldToSave)];
        } else {
            return this.getNewFields(fieldToSave);
        }
    }

    private getUpdatedField(fieldToSave: Field): Field {
        const fields = this.getFields();
        let result: Field;

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            if (this.formData.id === field.id) {
                result = Object.assign(field, fieldToSave);
                break;
            }
        }

        return result;
    }

    private getNewFields(fieldToSave: Field): Field[] {
        const fields = this.getFields();
        const result: Field[] = [];

        for (let i = 0; i < fields.length; i++) {
           if (FieldUtil.isNewField(fields[i])) {
                fields[i].sortOrder = i + 1;

                if (FieldUtil.isNotRowOrColumn(fields[i])) {
                    result.push(Object.assign(fields[i], fieldToSave));
                } else {
                    result.push(fields[i]);
                }
            }
        }

        return result;
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
        this.formData = fields.filter(field => FieldUtil.isNewField(field) && FieldUtil.isNotRowOrColumn(field))[0];
    }

    /**
     * Show or hide dialog
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    private toggleDialog(): void {
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

        this.formData = null;
        this.propertiesForm.destroy();
    }

    getDialogHeader(): string {
        const dialogTitle = this.formData && this.formData.id ?
            this.i18nMessages['contenttypes.dropzone.action.edit'] : this.i18nMessages['contenttypes.dropzone.action.create.field'];
        return `${dialogTitle}`;
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

    removeField(fieldToDelete: Field): void {
        this.removeFields.emit([fieldToDelete]);
    }

    removeFieldRow(fieldRow: FieldRow): void {
        this.fieldRows.splice(this.fieldRows.indexOf(fieldRow), 1);
        const fieldsToDelete: Field[] = [];

        fieldsToDelete.push(fieldRow.lineDivider);
        fieldRow.columns.forEach(fieldColumn => {
            fieldsToDelete.push(fieldColumn.tabDivider);
            fieldColumn.fields.forEach(field => fieldsToDelete.push(field));
        });

        this.removeFields.emit(fieldsToDelete);
    }
}
