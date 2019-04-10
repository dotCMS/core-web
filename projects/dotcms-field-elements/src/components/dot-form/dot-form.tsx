import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';
import { DotCMSContentTypeField } from '../../../../dotcms/src/lib/models';
import { DotFormFields } from './dot-form-fields';

@Component({
    tag: 'dot-form'
})
export class DotFormComponent {
    @Element() el: HTMLElement;
    @Event() formSubmit: EventEmitter;
    @Prop() fields = [];
    @Prop() resetLabel = 'Reset';
    @Prop() submitLabel = 'Submit';

    @Prop({ mutable: true }) _formValues = {};

    @Listen('valueChanges')
    onValueChanges(event: CustomEvent): void {
        this._formValues[event.detail.target.name] = event.detail.target.value;
    }

    @Listen('stateChanges')
    onStateChanges(event: CustomEvent): void {
        // refresh variables from hostData
        console.log('----onStateChanges', event);
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
        this._formValues = {};
        const elements = Array.from(this.el.querySelector('form').children);
        elements.forEach((element: any) => {
            try {
                element.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    getField(field: DotCMSContentTypeField): any {
        const fieldMap = {
            Text : ((fieldParam: DotCMSContentTypeField) => DotFormFields.Text(fieldParam)),
            Checkbox : ((fieldParam: DotCMSContentTypeField) => DotFormFields.Checkbox(fieldParam)),
            Select : ((fieldParam: DotCMSContentTypeField) => DotFormFields.Select(fieldParam))
        };
        return fieldMap[field.fieldType] ? fieldMap[field.fieldType](field) : '';
    }

    render() {
        return (
            <form onSubmit={(evt: Event) => this.handleSubmit(evt)}>
                <slot />
                {this.fields.map(this.getField)}
                <input type='submit' value={this.submitLabel} />
                <input type='button' value={this.resetLabel} onClick={() => this.resetForm()} />
            </form>
        );
    }
}
