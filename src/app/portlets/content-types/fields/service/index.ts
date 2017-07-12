export * from './field.service';
export * from './field-drag-drop.service';

export class FieldRow {

    columns: FieldColumn[];

    constructor(nColumns?: number) {
        this.columns = [];

        if (nColumns) {
            for (let i = 0; i < nColumns; i++) {
                this.columns[i] = {
                    fields: []
                };
            }
        }
    }

    addColumn(fieldColumn: FieldColumn): void {
        this.columns.push(fieldColumn);
    }
}

export interface FieldColumn {
    fields: Field[];
}

export interface FieldType {
    name: string;
}

export interface Field {
    dataType: string;
    fixed?: boolean;
    indexed?: boolean;
    listed?: boolean;
    name?: string;
    readOnly?: boolean;
    required?: boolean;
    sortOrder?: number;
    unique?: boolean;
    velocityVarName?: string;
}