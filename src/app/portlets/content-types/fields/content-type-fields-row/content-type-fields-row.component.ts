import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { DotCMSContentTypeField, DotCMSContentTypeLayoutRow } from '@dotcms/models';
import { DotMessageService } from '@services/dot-messages-service';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotCMSContentTypeLayoutColumn } from '@dotcms/models';
import { take } from 'rxjs/operators';

/**
 * Display all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'dot-content-type-fields-row',
    styleUrls: ['./content-type-fields-row.component.scss'],
    templateUrl: './content-type-fields-row.component.html'
})
export class ContentTypeFieldsRowComponent implements OnInit {
    @Input()
    fieldRow: DotCMSContentTypeLayoutRow;

    @Output()
    editField: EventEmitter<DotCMSContentTypeField> = new EventEmitter();
    @Output()
    removeField: EventEmitter<DotCMSContentTypeField> = new EventEmitter();
    @Output()
    removeRow: EventEmitter<DotCMSContentTypeLayoutRow> = new EventEmitter();

    i18nMessages: any = {};

    constructor(
        private dotMessageService: DotMessageService,
        private dotDialogService: DotAlertConfirmService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'contenttypes.dropzone.rows.empty.message',
                'contenttypes.action.delete',
                'contenttypes.confirm.message.delete.field',
                'contenttypes.confirm.message.delete.row',
                'contenttypes.content.field',
                'contenttypes.content.row',
                'contenttypes.action.cancel'
            ])
            .pipe(take(1))
            .subscribe((res) => {
                this.i18nMessages = res;
                document
                    .querySelector('html')
                    .style.setProperty(
                        '--empty-message',
                        `"${this.i18nMessages['contenttypes.dropzone.rows.empty.message']}"`
                    );
            });
    }

    /**
     * Remove a field
     *
     * @param DotContentTypeField field
     * @memberof ContentTypeFieldsRowComponent
     */
    onRemoveField(field: DotCMSContentTypeField): void {
        this.dotDialogService.confirm({
            accept: () => {
                this.removeField.emit(field);
            },
            header: `${this.i18nMessages['contenttypes.action.delete']} ${
                this.i18nMessages['contenttypes.content.field']
            }`,
            message: this.dotMessageService.get(
                'contenttypes.confirm.message.delete.field',
                field.name
            ),
            footerLabel: {
                accept: this.i18nMessages['contenttypes.action.delete'],
                reject: this.i18nMessages['contenttypes.action.cancel']
            }
        });
    }

    /**
     * Return the width for each column
     *
     * @returns string Return the column's width width '%', for example, '30%'
     * @memberof ContentTypeFieldsRowComponent
     */
    getColumnWidth(): string {
        const nColumns = this.fieldRow.columns.length;
        return `${100 / nColumns}%`;
    }

    /**
     * Tigger the removeRow event whit the current FieldRow
     *
     * @memberof ContentTypeFieldsRowComponent
     */
    onRemoveFieldRow(): void {
        this.removeRow.emit(this.fieldRow);
    }

    /**
     * Check if a given row have fields in any of the columns
     *
     * @param DotContentTypeLayoutDivider row
     * @returns boolean
     * @memberof ContentTypeFieldsRowComponent
     */
    rowHaveFields(row: DotCMSContentTypeLayoutRow): boolean {
        return row.columns
            .map((column: DotCMSContentTypeLayoutColumn) => column.fields.length)
            .every((fieldsNumber: number) => fieldsNumber === 0);
    }
}
