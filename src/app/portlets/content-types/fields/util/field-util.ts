import { DotContentTypeField, DotContentTypeLayoutDivider } from '../';
import { DotContentTypeColumn } from '../models';

const COLUMN_FIELD = {
    clazz: 'com.dotcms.contenttype.model.field.ImmutableColumnField'
};

const ROW_FIELD = {
    clazz: 'com.dotcms.contenttype.model.field.ImmutableRowField'
};

export const TAB_FIELD = {
    clazz: 'com.dotcms.contenttype.model.field.ImmutableTabDividerField'
};

export class FieldUtil {
    /**
     * Verify if the Field already exist
     * @param DotContentTypeField field
     * @returns Boolean
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isNewField(field: DotContentTypeField): Boolean {
        return !field.id;
    }


    /**
     * Return true if the field is a RowField or a ColumnField
     *
     * @static
     * @param {DotContentTypeField} field
     * @returns
     * @memberof FieldUtil
     */
    static isLayoutField(field: DotContentTypeField): boolean {
        return this.isRow(field) || this.isColumn(field);
    }

    /**
     * Verify if the Field is a row
     * @param DotContentTypeField field
     * @returns Boolean
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isRow(field: DotContentTypeField): boolean {
        return field.clazz === ROW_FIELD.clazz;
    }

    /**
     * Verify if the Field is a column
     * @param DotContentTypeField field
     * @returns Boolean
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isColumn(field: DotContentTypeField): boolean {
        return field.clazz === COLUMN_FIELD.clazz;
    }

    /**
     * Verify if the Field is a tab
     * @param {DotContentTypeField} field
     * @returns {Boolean}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isTabDivider(field: DotContentTypeField): boolean {
        return field.clazz === TAB_FIELD.clazz;
    }


    /**
     * Create a new row
     * @static
     * @param {number} nColumns
     * @returns {DotContentTypeLayoutDivider}
     * @memberof FieldUtil
     */
    static createFieldRow(nColumns: number): DotContentTypeLayoutDivider {
        return {
            divider: {...ROW_FIELD},
            columns: new Array(nColumns).fill(null).map(() => FieldUtil.createFieldColumn())
        };
    }


    /**
     * Create a new column
     *
     * @static
     * @returns {FieldColumn}
     * @memberof FieldUtil
     */
    static createFieldColumn(): DotContentTypeColumn {
        return {
            columnDivider: {...COLUMN_FIELD},
            fields: []
        };
    }


    /**
     * Create a new TabField
     *
     * @static
     * @returns {DotContentTypeLayoutDivider}
     * @memberof FieldUtil
     */
    static createFieldTabDivider(): DotContentTypeLayoutDivider {
        return {
            divider: Object.assign({}, TAB_FIELD)
        };
    }


    /**
     * Split the fields array by FieldDivider: for example if we have a field array like:
     * ROW_FIELD, COLUMN_FIELD,TEXT_FIELD,TAB_FIELD,ROW_FIELD,COLUMN_FIELD,TEXT_FIELD
     * 
     * then you would get:
     * [ROW_FIELD, COLUMN_FIELD,TEXT_FIELD], [TAB_FIELD] , [ROW_FIELD, COLUMN_FIELD, TEXT_FIELD]
     *
     * @static
     * @param {DotContentTypeField[]} fields
     * @returns {DotContentTypeField[][]}
     * @memberof FieldUtil
     */
    static getRows(fields: DotContentTypeField[]): DotContentTypeField[][] {
        return FieldUtil.splitFieldsBy(fields, [ROW_FIELD.clazz, TAB_FIELD.clazz]);
    }


    /**
     * Split the fields array by ColumnField: for example if we have a field array like:
     * COLUMN_FIELD,TEXT_FIELD,COLUMN_FIELD,TEXT_FIELD
     * 
     * then you would get:
     * [COLUMN_FIELD,TEXT_FIELD], [COLUMN_FIELD,TEXT_FIELD]
     *
     * @static
     * @param {DotContentTypeField[]} fields
     * @returns {DotContentTypeField[][]}
     * @memberof FieldUtil
     */
    static getColumns(fields: DotContentTypeField[]): DotContentTypeField[][] {
        return FieldUtil.splitFieldsBy(fields, [COLUMN_FIELD.clazz]);
    }


    /**
     * Split the fields array by fieldClass: for example if we have a field array like:
     * COLUMN_FIELD,TEXT_FIELD,COLUMN_FIELD,TEXT_FIELD
     * 
     * and fieldClass is equal to 'com.dotcms.contenttype.model.field.ImmutableColumnField', then you would get:
     * [COLUMN_FIELD,TEXT_FIELD], [COLUMN_FIELD,TEXT_FIELD]
     *
     * @static
     * @param {DotContentTypeField[]} fields
     * @param {string[]} fieldClass
     * @returns {DotContentTypeField[][]}
     * @memberof FieldUtil
     */
    static splitFieldsBy(fields: DotContentTypeField[], fieldClass: string[]): DotContentTypeField[][] {
        const result: DotContentTypeField[][] = [];
        let currentFields: DotContentTypeField[];

        fields.forEach((field: DotContentTypeField) => {
            if (fieldClass.includes(field.clazz)) {
                currentFields = [];
                result.push(currentFields);
            }

            /*
                TODO: this code is for avoid error in edit mode when the content types don'thas
                ROW_FIELD and COLUMN_FIELD, this happend when the content types is saved in old UI
                but I dont know if this it's the bets fix
            */
            if (!currentFields) {
                currentFields = [];
                result.push(currentFields);
            }

            currentFields.push(field);
        });

        return result;
    }

    /**
     * Get all the not layout fields from a layout, layout field could be RowField, ColumnFiled and TabField
     *
     * @static
     * @param {DotContentTypeLayoutDivider[]} layout
     * @returns {DotContentTypeField[]}
     * @memberof FieldUtil
     */
    static getFieldsWithoutLayout(layout: DotContentTypeLayoutDivider[]): DotContentTypeField[] {
        return layout.map(row => row.columns)
            .filter(columns => !!columns)
            .reduce((accumulator: DotContentTypeColumn[], currentValue: DotContentTypeColumn[]) => accumulator.concat(currentValue), [])
            .map(fieldColumn => fieldColumn.fields)
            .reduce((accumulator: DotContentTypeField[], currentValue: DotContentTypeField[]) => accumulator.concat(currentValue), []);
    }

    /**
     * Return just the TabField from a layout
     *
     * @static
     * @param {DotContentTypeLayoutDivider[]} layout
     * @returns {DotContentTypeField[]}
     * @memberof FieldUtil
     */
    static getTabDividerFields(layout: DotContentTypeLayoutDivider[]): DotContentTypeField[] {
        return layout.map(row => row.divider)
            .filter((field: DotContentTypeField) => FieldUtil.isTabDivider(field));
    }
}
