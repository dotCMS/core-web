import { ContentTypeField } from './field.model';

export interface FieldColumn {
    fields: ContentTypeField[];
    columnDivider: ContentTypeField;
}
