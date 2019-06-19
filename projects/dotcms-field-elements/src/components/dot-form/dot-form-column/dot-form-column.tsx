import { Component, Prop } from '@stencil/core';
import { DotCMSFieldColumn, DotCMSContentTypeField } from '../models';
import { fieldMap, shouldShowField } from '../utils';

@Component({
    tag: 'dot-form-column',
    styleUrl: 'dot-form-column.scss'
})
export class DotFormColumnComponent {
    @Prop({ mutable: true, reflectToAttr: true }) column: DotCMSFieldColumn;
    @Prop() fieldsToShow: string[] = [];

    render() {
        return this.column.fields.map((field: DotCMSContentTypeField) => {
            return <div class="dot-form__column dot-form__fields">{this.getField(field)}</div>;
        });
    }

    private getField(field: DotCMSContentTypeField): JSX.Element {
        return shouldShowField(field, this.fieldsToShow) ? this.getFieldTag(field) : '';
    }

    private getFieldTag(field: DotCMSContentTypeField): JSX.Element {
        return fieldMap[field.fieldType] ? fieldMap[field.fieldType](field) : '';
    }
}
