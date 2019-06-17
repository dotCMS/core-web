import { Component, Element, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { DotCMSContentTypeField, DotCMSFieldRow, DotCMSFieldColumn } from './models';
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
        this.getUpdateFieldsValues();
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
                {this.fields.map((row: DotCMSFieldRow) => {
                    return (
                        <div class="form__row">
                            {row.columns.map((fieldColumn: DotCMSFieldColumn) => {
                                return fieldColumn.fields.map((field: DotCMSContentTypeField) => {
                                    return this.getField(field);
                                });
                            })}
                        </div>
                    );
                })}

                <div class="form__buttons">
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

    private getField(field: DotCMSContentTypeField): JSX.Element {
        return this.shouldShowField(field) ? this.getFieldTag(field) : '';
    }

    private getFieldTag(field: DotCMSContentTypeField): JSX.Element {
        return fieldMap[field.fieldType] ? (
            <div class="form__column form__fields">{fieldMap[field.fieldType](field)}</div>
        ) : (
            ''
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

    private getUpdateFieldsValues(): void {
        this.fields.forEach((row: DotCMSFieldRow, rowIndex: number) => {
            row.columns.forEach((fieldColumn: DotCMSFieldColumn, columnIndex: number) => {
                fieldColumn.fields.forEach((field: DotCMSContentTypeField, fieldIndex: number) => {
                    this.fields[rowIndex].columns[columnIndex].fields[fieldIndex] =
                        typeof this.value[field.variable] !== 'undefined'
                            ? { ...field, defaultValue: this.value[field.variable] }
                            : { ...field };
                });
            });
        });
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.onSubmit.emit({
            ...this.value
        });
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

    private shouldShowField(field: DotCMSContentTypeField): boolean {
        return !this.fieldsToShow.length || this.fieldsToShow.includes(field.variable);
    }

    private updateValue(): void {
        this.value = {};

        this.fields.forEach((row: DotCMSFieldRow) => {
            row.columns.forEach((fieldColumn: DotCMSFieldColumn) => {
                fieldColumn.fields.forEach((field: DotCMSContentTypeField) => {
                    if (this.shouldShowField(field)) {
                        this.value[field.variable] = field.defaultValue || '';
                    }
                });
            });
        });
    }
}
