import { ContentTypeField, FieldDivider } from '../';
import { FieldColumn } from '../shared';

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
    // private static NG_ID_SEQUENCER = new Date().getTime();
    /**
     * Verify if the Field already exist
     * @param ContentTypeField field
     * @returns Boolean
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isNewField(field: ContentTypeField): Boolean {
        return !field.id;
    }

    static isRowOrColumn(field: ContentTypeField) {
        return this.isRow(field) || this.isColumn(field);
    }

    /**
     * Verify if the Field is a row
     * @param ContentTypeField field
     * @returns Boolean
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isRow(field: ContentTypeField): boolean {
        return field.clazz === ROW_FIELD.clazz;
    }

    /**
     * Verify if the Field is a column
     * @param ContentTypeField field
     * @returns Boolean
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isColumn(field: ContentTypeField): boolean {
        return field.clazz === COLUMN_FIELD.clazz;
    }

    /**
     * Verify if the Field is a tab
     * @param {ContentTypeField} field
     * @returns {Boolean}
     * @memberof ContentTypeFieldsDropZoneComponent
     */
    static isTabDivider(field: ContentTypeField): boolean {
        return field.clazz === TAB_FIELD.clazz;
    }

    static createFieldRow(nColumns: number): FieldDivider {
        console.log();
        return {
            divider: Object.assign({}, ROW_FIELD),
            columns: new Array(nColumns).fill(null).map(() => FieldUtil.createFieldColumn())
        };
    }

    static createFieldColumn(): FieldColumn {
        return {
            columnDivider: Object.assign({}, COLUMN_FIELD),
            fields: []
        };
    }

    static createFieldTabDivider(): FieldDivider {
        return {
            divider: Object.assign({}, TAB_FIELD)
        };
    }

    static splitFieldsByRows(fields: ContentTypeField[]): ContentTypeField[][] {
        return FieldUtil.splitFieldsBy(fields, [ROW_FIELD.clazz, TAB_FIELD.clazz]);
    }

    static splitFieldsByTabDivider(fields: ContentTypeField[]): ContentTypeField[][] {
        return FieldUtil.splitFieldsBy(fields, [COLUMN_FIELD.clazz]);
    }

    static splitFieldsBy(fields: ContentTypeField[], fieldClass: string[]): ContentTypeField[][] {
        const result: ContentTypeField[][] = [];
        let currentFields: ContentTypeField[];

        fields.forEach((field: ContentTypeField) => {
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
}
