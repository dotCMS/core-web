import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { DotCMSContentTypeField, DotCMSContentTypeRow, DotCMSContentTypeColumn } from './models';
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

    /** (optional) List of fields (variableName) separated by comma, to be shown */
    @Prop() fieldsToShow: string;

    /** (optional) Text to be rendered on Reset button */
    @Prop({ reflectToAttr: true }) resetLabel = 'Reset';

    /** (optional) Text to be rendered on Submit button */
    @Prop({ reflectToAttr: true }) submitLabel = 'Submit';

    /** Layout metada to be rendered */
    @Prop({ mutable: true, reflectToAttr: true }) layout: DotCMSContentTypeRow[] = [];

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

    @Watch('layout')
    layoutWatch() {
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
                {this.layout.map((row: DotCMSContentTypeRow) => {
                    return <dot-form-row row={row} fields-to-show={this.fieldsToShow} />;
                })}
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

    private updateValue(): any {

        // return this.layout
        //     .reduce((acc, { columns }) => [...acc, ...columns.map((col: DotCMSContentTypeColumn) => col.fields)], [])
        //     .flat()
        //     .reduce((acc, { variable, defaultValue }) => {
        //         return {
        //             ...acc,
        //             [variable]: defaultValue
        //         };
        //     }, {});

        this.value = {};

        this.layout.forEach((row: DotCMSContentTypeRow) => {
            row.columns.forEach((fieldColumn: DotCMSContentTypeColumn) => {
                fieldColumn.fields.forEach((field: DotCMSContentTypeField) => {
                    if (shouldShowField(field, this.fieldsToShow)) {
                        this.value[field.variable] = field.defaultValue || '';
                    }
                });
            });
        });
    }
}
