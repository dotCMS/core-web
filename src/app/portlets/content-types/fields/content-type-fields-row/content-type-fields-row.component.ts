import { Component, Input } from '@angular/core';
import { Field, FieldRow } from '../service';

/**
 * Show all the Field Types
 *
 * @export
 * @class FieldTypesContainerComponent
 */
@Component({
    selector: 'content-type-fields-row',
    styles: [require('./content-type-fields-row.component.scss')],
    templateUrl: './content-type-fields-row.component.html',
})
export class ContentTypeFieldsRowComponent {
    @Input() fieldRow: FieldRow;

    removeField(field: Field): void {
        this.fieldRow.columns = this.fieldRow.columns.map(col => {
            let index: number = col.fields.indexOf(field);

            if (index !== -1) {
                col.fields.splice(index, 1);
             }
            return col;
        });
    }

    getSpanWidth(): string {
        let nColumns = this.fieldRow.columns.length;
        return `${(100 - nColumns) / nColumns}%`;
    }
}