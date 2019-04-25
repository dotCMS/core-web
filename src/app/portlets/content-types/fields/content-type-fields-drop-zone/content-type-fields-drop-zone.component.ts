import {
    Component,
    SimpleChanges,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { FieldDragDropService, DropFieldData } from '../service';
import { DotContentTypeField, FieldType, DotFieldDivider } from '../shared';
import { ContentTypeFieldsPropertiesFormComponent } from '../content-type-fields-properties-form';
import { DotMessageService } from '@services/dot-messages-service';
import { FieldUtil } from '../util/field-util';
import { FieldPropertyService } from '../service/field-properties.service';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import { takeUntil, take  } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DotFieldVariableParams } from '../dot-content-type-fields-variables/models/dot-field-variable-params.interface';
import { DotLoadingIndicatorService } from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.service';

/**
 * Display all the Field Types
 *
 * @export
 * @class ContentTypeFieldsDropZoneComponent
 */
@Component({
    selector: 'dot-content-type-fields-drop-zone',
    styleUrls: ['./content-type-fields-drop-zone.component.scss'],
    templateUrl: './content-type-fields-drop-zone.component.html'
})
export class ContentTypeFieldsDropZoneComponent implements OnInit, OnChanges, OnDestroy {
    readonly OVERVIEW_TAB_INDEX = 0;

    dialogActiveTab: number;
    displayDialog = false;
    formData: DotContentTypeField;
    currentFieldType: FieldType;
    currentField: DotFieldVariableParams;
    dialogActions: DotDialogActions;
    fieldRows: DotFieldDivider[];

    @ViewChild('fieldPropertiesForm')
    propertiesForm: ContentTypeFieldsPropertiesFormComponent;

    @Input()
    layout: DotFieldDivider[];

    @Output()
    saveFields = new EventEmitter<DotContentTypeField[]>();
    @Output()
    removeFields = new EventEmitter<DotContentTypeField[]>();

    hideButtons = false;

    i18nMessages: {
        [key: string]: string;
    } = {};

    private _loading: boolean;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public dotMessageService: DotMessageService,
        private fieldDragDropService: FieldDragDropService,
        private fieldPropertyService: FieldPropertyService,
        private dotEventsService: DotEventsService,
        private dotLoadingIndicatorService: DotLoadingIndicatorService
    ) {}

    ngOnInit(): void {
        this.dotMessageService
            .getMessages([
                'contenttypes.dropzone.action.save',
                'contenttypes.dropzone.action.cancel',
                'contenttypes.dropzone.action.edit',
                'contenttypes.dropzone.action.create.field',
                'contenttypes.dropzone.empty.message',
                'contenttypes.dropzone.tab.overview',
                'contenttypes.dropzone.tab.variables',
                'contenttypes.dropzone.empty.message'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.i18nMessages = messages;
                this.dialogActions = {
                    accept: {
                        action: () => {
                            this.propertiesForm.saveFieldProperties();
                        },
                        label: this.i18nMessages['contenttypes.dropzone.action.save'],
                        disabled: true
                    },
                    cancel: {
                        label: this.i18nMessages['contenttypes.dropzone.action.cancel'],
                        action: () => {}
                    }
                };
            });

        this.fieldDragDropService.fieldDropFromSource$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DropFieldData) => {
                this.setDroppedField(data.item);
                this.toggleDialog();
            });

        this.fieldDragDropService.fieldDropFromTarget$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => setTimeout(() => {
                this.emitSaveEventIfNecessary(this.getFieldsFromLayout());
            }, 0));

        this.fieldDragDropService.fieldRowDropFromTarget$
            .pipe(takeUntil(this.destroy$))
            .subscribe((fieldRows: DotFieldDivider[]) => {
                this.fieldRows = fieldRows;
                this.emitSaveEventIfNecessary(this.getFieldsFromLayout());
            });

        this.dotEventsService
            .listen('add-row')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                document.querySelector('dot-add-rows').scrollIntoView({
                    behavior: 'smooth'
                });
            });

        this.dotEventsService
            .listen('add-tab-divider')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const fieldTab: DotFieldDivider = FieldUtil.createFieldTabDivider();
                this.fieldRows.push(fieldTab);
                this.setDroppedField(fieldTab.divider);
                this.toggleDialog();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.layout && changes.layout.currentValue) {
            this.fieldRows = changes.layout.currentValue;
        }
    }

    @Input()
    set loading(loading: boolean) {
        this._loading = loading;

        if (loading) {
            this.dotLoadingIndicatorService.show();
        } else {
            this.dotLoadingIndicatorService.hide();
        }
    }

    get loading(): boolean {
        return this._loading;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Adds row to the layout of content type
     * @param number columns new row's number of columns
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    addRow(columns: number): void {
        const newRow = FieldUtil.createFieldRow(columns);
        this.fieldRows.push(newRow);
    }

    /**
     * Emit the saveField event
     * @param DotContentTypeField fieldToSave
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    saveFieldsHandler(fieldToSave: DotContentTypeField): void {
        console.log('fieldToSave', fieldToSave);
        console.log('this.formData', this.formData);

        const fields: DotContentTypeField[] = this.getFieldsFromLayout().map(field =>
            fieldToSave.id === field.id && !FieldUtil.isRowOrColumn(field) ?
                this.mergeFields(field, fieldToSave) : field);

        console.log('fields', fields);

        this.toggleDialog();
        this.emitSaveEventIfNecessary(fields);
    }

    /**
     * Get the field to be edited
     * @param DotContentTypeField fieldToEdit
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    editField(fieldToEdit: DotContentTypeField): void {
        this.formData = this.getFieldsFromLayout().filter((field) => fieldToEdit.id === field.id)[0];
        this.currentFieldType = this.fieldPropertyService.getFieldType(this.formData.clazz);
        this.currentField = {
            fieldId: this.formData.id,
            contentTypeId: this.formData.contentTypeId
        };
        this.toggleDialog();
    }

    /**
     * Removes the last dropped field added without ID
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    removeFieldsWithoutId(): void {
        console.log('removeFieldsWithoutId');
        const fieldRows: any = this.fieldRows;

        // TODO needs an improvement for performance reasons
        fieldRows.forEach((row, rowIndex) => {
            if (row.columns) {
                row.columns.forEach((col, colIndex) => {
                    col.fields.forEach((field, fieldIndex) => {
                        if (!field.id) {
                            row.columns[colIndex].fields.splice(fieldIndex, 1);
                        }
                    });
                });
            } else if (!row.fieldDivider.name) {
                this.fieldRows.splice(rowIndex, 1);
            }
        });
        this.hideButtons = false;
        this.displayDialog = false;
        this.formData = null;
        this.dialogActiveTab = null;
        this.propertiesForm.destroy();
        this.setDialogOkButtonState(false);
    }

    /**
     * Trigger the removeFields event with fieldToDelete
     * @param {DotContentTypeField} fieldToDelete
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    removeField(fieldToDelete: DotContentTypeField): void {
        this.removeFields.emit([fieldToDelete]);
    }

    /**
     * Trigger the removeFields event with all the fields in fieldRow
     * @param {DotFieldDivider} fieldRow
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    removeFieldRow(fieldRow: DotFieldDivider): void {
        this.fieldRows.splice(this.fieldRows.indexOf(fieldRow), 1);
        const fieldsToDelete: DotContentTypeField[] = [];

        if (!FieldUtil.isNewField(fieldRow.divider)) {
            fieldsToDelete.push(fieldRow.divider);
            fieldRow.columns.forEach((fieldColumn) => {
                fieldsToDelete.push(fieldColumn.columnDivider);
                fieldColumn.fields.forEach((field) => fieldsToDelete.push(field));
            });
            this.removeFields.emit(fieldsToDelete);
        }
    }

    /**
     * Trigger the removeFields event with the tab to be removed
     * @param {DotFieldDivider} fieldTab
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    removeTab(fieldTab: DotFieldDivider): void {
        this.fieldRows.splice(this.fieldRows.indexOf(fieldTab), 1);
        this.removeFields.emit([fieldTab.divider]);
    }

    /**
     * Cancel the last drag and drop operation
     *
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    cancelLastDragAndDrop(): void {
        this.fieldRows = this.layout;
    }

    /**
     * Set the state for the ok action for the dialog
     *
     * @param {boolean} $event
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    setDialogOkButtonState(formChanged: boolean): void {
        this.dialogActions = {
            ...this.dialogActions,
            accept: {
                ...this.dialogActions.accept,
                disabled: !formChanged
            }
        };
    }

     /**
      * Hide or show the 'save' and 'hide' buttons according to the field tab selected
      * 
      * @param index
      */
    handleTabChange(index: number): void {
        this.hideButtons = index !== this.OVERVIEW_TAB_INDEX;
    }

    private mergeFields(field: DotContentTypeField, fieldToSave: DotContentTypeField): DotContentTypeField {
        console.log('mergeFields');
        return {
            ...field,
            ...fieldToSave,
            ...{
                sortOrder: -1
            }
        };
    }

    private setDroppedField(droppedField: DotContentTypeField): void {
        this.formData = droppedField;

        if (this.formData) {
            this.currentFieldType = this.fieldPropertyService.getFieldType(this.formData.clazz);
        }
    }

    private emitSaveEventIfNecessary(currentFields: DotContentTypeField[]): void {

        const fields = currentFields.filter((field, index) => {
            const currentSortOrder = index;

            if (this.isFieldChanged(field, currentSortOrder)) {
                field.sortOrder = currentSortOrder;
                return true;
            } else {
                return false;
            }
        });

        if (fields && fields.length) {
            this.saveFields.emit(fields);
        }
    }

    private isFieldChanged(field: DotContentTypeField, currentSortOrder: number): boolean {
        return FieldUtil.isNewField(field) || field.sortOrder !== currentSortOrder;
    }

    private toggleDialog(): void {
        this.displayDialog = !this.displayDialog;
        this.dialogActiveTab = 0;

        if (!this.displayDialog) {
            this.propertiesForm.destroy();
        }
    }

    private getFieldsFromLayout(): DotContentTypeField[] {
        const fields: DotContentTypeField[] = [];

        this.fieldRows.forEach((fieldDivider: DotFieldDivider) => {
            const divider: DotContentTypeField = fieldDivider.divider;

            fields.push(divider);

            if (FieldUtil.isRow(fieldDivider.divider)) {
                fieldDivider.columns.forEach((fieldColumn) => {
                    fields.push(fieldColumn.columnDivider);
                    fieldColumn.fields.forEach((field) => fields.push(field));
                });
            }
        });

        return fields;
    }
}
