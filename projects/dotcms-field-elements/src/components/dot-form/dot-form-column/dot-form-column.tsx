import { Component, Prop } from '@stencil/core';
import { DotCMSContentTypeColumn, DotCMSContentTypeField } from '../models';
import { fieldMap, shouldShowField } from '../utils';

@Component({
    tag: 'dot-form-column',
    styleUrl: 'dot-form-column.scss'
})
export class DotFormColumnComponent {

    /** Fields metada to be rendered */
    @Prop({ mutable: true, reflectToAttr: true }) column: DotCMSContentTypeColumn;

    /** (optional) List of fields (variableName) separated by comma, to be shown */
    @Prop({ mutable: true, reflectToAttr: true }) fieldsToShow: string;

    fields2Show: string[];

    componentWillLoad() {
        this.fields2Show = this.fieldsToShow ? this.fieldsToShow.split(',') : [];
    }

    render() {
        return this.column.fields.map((field: DotCMSContentTypeField) => {
            return <div class="dot-form__column dot-form__fields">{this.getField(field)}</div>;
        });
    }

    private getField(field: DotCMSContentTypeField): JSX.Element {
        return shouldShowField(field, this.fields2Show) ? this.getFieldTag(field) : '';
    }

    private getFieldTag(field: DotCMSContentTypeField): JSX.Element {
        return fieldMap[field.fieldType] ? fieldMap[field.fieldType](field) : '';
    }
}
