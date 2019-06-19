import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { DotCMSContentTypeField, DotCMSFieldRow, DotCMSFieldColumn } from './models';
import { DotFieldStatus } from '../../models';
import { fieldParamsConversionToBE, shouldShowField } from './utils';
import { getClassNames, getOriginalStatus, updateStatus } from '../../utils';

@Component({
    tag: 'dot-form',
    styleUrl: 'dot-form.scss'
})
export class DotFormComponent {
    @Element() el: HTMLElement;

    @Event() onSubmit: EventEmitter;

    @Prop() fieldsToShow: string[] = [];
    @Prop({ reflectToAttr: true }) resetLabel = 'Reset';
    @Prop({ reflectToAttr: true }) submitLabel = 'Submit';
    @Prop({ mutable: true, reflectToAttr: true }) fields: DotCMSFieldRow[] = [];

    @State() status: DotFieldStatus = getOriginalStatus();

    private fieldsStatus: { [key: string]: { [key: string]: boolean } } = {};
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
    }

    /**
     * Update the form status when statusChange in any of the child fields
     *
     * @param CustomEvent event
     * @memberof DotFormComponent
     */
    @Listen('statusChange')
    onStatusChange({ detail }: CustomEvent): void {
        this.fieldsStatus[detail.name] = detail.status;

        this.status = updateStatus(this.status, {
            dotTouched: this.getTouched(),
            dotPristine: this.getStatusValueByName('dotPristine'),
            dotValid: this.getStatusValueByName('dotValid')
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
                <dot-form-row fields={this.fields} fields-to-show={this.fieldsToShow} />
                <slot />
                <div class="dot-form__buttons">
                    <button type="reset" onClick={() => this.resetForm()}>
                        {this.resetLabel}
                    </button>
                    <button type="submit" disabled={!this.status.dotValid}>
                        {this.submitLabel}
                    </button>
                </div>
            </form>
        );
    }

    private getStatusValueByName(name: string): boolean {
        return Object.values(this.fieldsStatus)
            .map((field: { [key: string]: boolean }) => field[name])
            .every((item: boolean) => item === true);
    }

    private getTouched(): boolean {
        return Object.values(this.fieldsStatus)
            .map((field: { [key: string]: boolean }) => field.dotTouched)
            .includes(true);
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.onSubmit.emit({
            ...this.value
        });
    }

    private resetForm(): void {
        const elements = Array.from(this.el.querySelectorAll('form .dot-form__fields > *'));

        elements.forEach((element: any) => {
            try {
                element.reset();
            } catch (error) {
                console.warn(`${element.tagName}`, error);
            }
        });
    }

    private updateValue(): void {
        this.value = {};

        this.fields.forEach((row: DotCMSFieldRow) => {
            row.columns.forEach((fieldColumn: DotCMSFieldColumn) => {
                fieldColumn.fields.forEach((field: DotCMSContentTypeField) => {
                    if (shouldShowField(field, this.fieldsToShow)) {
                        this.value[field.variable] = field.defaultValue || '';
                    }
                });
            });
        });
    }
}
