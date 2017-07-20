import { FieldColumn } from './field-column';
import { Field, LINE_DIVIDER, TAB_DIVIDER } from './';

export class FieldRow {

    columns: FieldColumn[];
    lineDivider: Field;

    constructor(nColumns?: number) {
        this.columns = [];

        if (nColumns) {
            for (let i = 0; i < nColumns; i++) {
                this.columns[i] = new FieldColumn();
            }
        }

        this.lineDivider = Object.assign({}, LINE_DIVIDER);
    }

    addFields(fields:  Field[]): void {
        let offset = 0;

        if (fields[0].clazz === LINE_DIVIDER.clazz) {
            this.lineDivider = fields[0];
            offset = 1;
        }

        let fieldsSplitByTabDivider: Field[][] = this.splitFieldsByTabDiveder(fields.splice(offset));
        fieldsSplitByTabDivider.forEach(
            fields => this.columns.push(new FieldColumn(fields))
        );
    }

    private splitFieldsByTabDiveder(fields: Field[]): Field[][] {
        let result: Field[][] = [];
        let currentFields: Field[] = [];

        fields.map(field => {
            if (field.clazz === TAB_DIVIDER.clazz) {
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
}