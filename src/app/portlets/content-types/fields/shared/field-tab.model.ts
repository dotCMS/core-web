import { FieldDivider } from '@portlets/content-types/fields/shared/field-divider.interface';
import { ContentTypeField } from '@portlets/content-types/fields/shared';

export class FieldTab implements FieldDivider {
    constructor(private fieldTab: ContentTypeField) {

    }

    get field() {
        return this.fieldTab;
    }
}
