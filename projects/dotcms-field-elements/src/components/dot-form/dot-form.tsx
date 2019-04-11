import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { DotCMSContentTypeField } from '../../../../dotcms/src/lib/models';
import { DotFormFields } from './dot-form-fields';

const fieldMap = {
    Text : ((fieldParam: DotCMSContentTypeField) => DotFormFields.Text(fieldParam)),
    Checkbox : ((fieldParam: DotCMSContentTypeField) => DotFormFields.Checkbox(fieldParam)),
    Select : ((fieldParam: DotCMSContentTypeField) => DotFormFields.Select(fieldParam))
};

@Component({
    tag: 'dot-form'
})
export class DotFormComponent {
    @Element() el: HTMLElement;
    @Event() formSubmit: EventEmitter;
    @Prop() fields = [];
    @Prop() fieldsToShow = [];
    @Prop() resetLabel = 'Reset';
    @Prop() submitLabel = 'Submit';

    @Prop({ mutable: true }) _formValues = {};

    @Listen('valueChanges')
    onValueChanges(event: any): void {
        this._formValues[event.detail.name] = event.detail.value;
    }

    @Listen('stateChanges')
    onStateChanges(event: CustomEvent): void {
        // refresh variables from hostData
    }

    hostData() {
        // TODO: do validation here
        return {
          'class': { 'is-open': this._formValues },
          'aria-hidden': this._formValues ? 'false' : 'true'
        };
      }

    handleSubmit(evt: Event): void {
        evt.preventDefault();
        this.formSubmit.emit({
            ...this._formValues
        });
    }

    resetForm(): void {
        const elements = Array.from(this.el.querySelectorAll('form > *:not(button)'));
        elements.forEach((element: any) => {
            try {
                element.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    getFieldTag(field: DotCMSContentTypeField): any {
        return fieldMap[field.fieldType] ? fieldMap[field.fieldType](field) : '';
    }

    areFieldsToShowDefined(field: DotCMSContentTypeField): boolean {
        return this.fieldsToShow.length > 0 && this.fieldsToShow.includes(field.variable);
    }


    getField(field: DotCMSContentTypeField): any {
        return this.areFieldsToShowDefined(field) || this.fieldsToShow.length === 0 ? this.getFieldTag(field) : '';
    }

    componentWillLoad() {
        this.fields.forEach((field: DotCMSContentTypeField) => {
            if (this.getFieldTag(field)) {
                this._formValues[field.variable] = field.defaultValue || '';
            }
        });
    }

    render() {
        return (
            <form onSubmit={(evt: Event) => this.handleSubmit(evt)}>
                <slot />
                {this.fields.map((field: DotCMSContentTypeField) => this.getField(field))}
                <button type='submit'>{this.submitLabel}</button>
                <button type='button' onClick={() => this.resetForm()} >{this.resetLabel}</button>
            </form>
        );
    }
}
