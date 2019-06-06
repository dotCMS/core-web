import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { DotCMSContentTypeField } from './models';
import { DotFieldStatus } from '../../models';
import { fieldParamsConversionToBE, fieldMap } from './utils';
import { getClassNames, getOriginalStatus, updateStatus } from '../../utils';

@Component({
    tag: 'dot-form',
    styleUrl: 'dot-form.scss'
})
export class DotFormComponent {
    @Element() el: HTMLElement;

    @Event() onSubmit: EventEmitter;

    @Prop() fieldsToShow: string[] = [];
    @Prop() resetLabel = 'Reset';
    @Prop() submitLabel = 'Submit';
    @Prop({ mutable: true }) fields: DotCMSContentTypeField[] = [];

    @State() status: DotFieldStatus = getOriginalStatus();

    private fieldsStatus: { [key: string]: string } = {};
    private value = {};

    /**
     * Update the form value when valueChange in any of the child fields.
     *
     * @param CustomEvent event
     * @memberof DotFormComponent
     */
    @Listen('valueChange')
    onValueChange(event: CustomEvent): void {
        const { tagName } = event.target as HTMLElement;
        const { name, value } = event.detail;
        const transform = fieldParamsConversionToBE[tagName];

        this.value[name] = transform ? transform(value) : value;
        this.fields = this.getUpdateFieldsValues();
    }

    /**
     * Update the form status when statusChange in any of the child fields
     *
     * @param CustomEvent event
     * @memberof DotFormComponent
     */
    @Listen('statusChange')
    onStatusChange(event: CustomEvent): void {
        this.fieldsStatus[event.detail.name] = event.detail.status;
        this.status = updateStatus(this.status, {
            dotTouched: this.getStatusValue('dotTouched'),
            dotPristine: this.getStatusValue('dotPristine'),
            dotValid: this.getStatusValue('dotValid')
        });
    }

    @Watch('fields')
    fieldsWatch() {
        this.updateValue();
    }

    @Watch('fieldsToShow')
    fieldsToShowWatch() {
        this.updateValue();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.status.dotValid)
        };
    }

    componentWillLoad() {
        this.updateValue();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div class="form__fields">
                    {this.fields.map((field: DotCMSContentTypeField) => this.getField(field))}
                </div>

                <div class="form__buttons">
                    <button type="reset" onClick={() => this.resetForm()}>{this.resetLabel}</button>
                    <button type="submit" disabled={!this.status.dotValid}>
                        {this.submitLabel}
                    </button>
                </div>
            </form>
        );
    }

    private updateValue(): void {
        this.value = {};

        this.fields.forEach((field: DotCMSContentTypeField) => {
            if (this.shouldShowField(field)) {
                this.value[field.variable] = field.defaultValue || '';
            }
        });
    }

    private getUpdateFieldsValues(): DotCMSContentTypeField[] {
        return this.fields.map((field: DotCMSContentTypeField) => {
            return typeof this.value[field.variable] !== 'undefined'
                ? { ...field, defaultValue: this.value[field.variable] }
                : field;
        });
    }

    private getStatusValue(name: string): boolean {
        let value;
        const fields = Object.keys(this.fieldsStatus);

        for (const field of fields) {
            if (!this.fieldsStatus[field][name]) {
                value = this.fieldsStatus[field][name];
                break;
            }
            value = this.fieldsStatus[field][name];
        }
        return value;
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.onSubmit.emit({
            ...this.value
        });
    }

    private getFieldTag(field: DotCMSContentTypeField): any {
        return fieldMap[field.fieldType] ? fieldMap[field.fieldType](field) : '';
    }

    private shouldShowField(field: DotCMSContentTypeField): boolean {
        return !this.fieldsToShow.length || this.fieldsToShow.includes(field.variable);
    }

    private getField(field: DotCMSContentTypeField): any {
        return this.shouldShowField(field) ? this.getFieldTag(field) : '';
    }

    private resetForm(): void {
        const elements = Array.from(this.el.querySelectorAll('form .form__fields > *'));

        elements.forEach((element: any) => {
            try {
                element.reset();
            } catch (error) {
                console.warn(`${element.tagName}`, error);
            }
        });
    }
}
