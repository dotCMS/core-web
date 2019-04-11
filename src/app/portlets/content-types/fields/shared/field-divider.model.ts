import { ContentTypeField, FieldColumn } from '@portlets/content-types/fields';

export interface FieldDivider {
    divider: ContentTypeField;
    columns?: FieldColumn[];
}
