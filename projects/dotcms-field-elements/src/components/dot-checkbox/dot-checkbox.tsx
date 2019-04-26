import { Component, Prop, State, Element, Method, Event, EventEmitter } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotOption, DotFieldStatus, DotFieldValueEvent, DotFieldStatusEvent } from '../../models';
import {
    getClassNames,
    getOriginalStatus,
    getTagHint,
    getTagError,
    getTagLabel,
    getErrorClass,
    getDotOptionsFromFieldValue,
    updateStatus
} from '../../utils';

@Component({
    tag: 'dot-checkbox',
    styleUrl: 'dot-checkbox.scss'
})
export class DotCheckboxComponent {
    @Element() el: HTMLElement;

    @Prop() disabled = false;
    @Prop() name: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() options: string;
    @Prop() required: boolean;
    @Prop() requiredmessage: string;
    @Prop({ mutable: true }) value: string;

    @State() _options: DotOption[];
    @State() _valid = true;
    @State() status: DotFieldStatus = getOriginalStatus();

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    componentWillLoad() {
        this._options = getDotOptionsFromFieldValue(this.options);
        this.emitValueChange();
        this.emitStatusChange();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid())
        };
    }

    /**
     * Reset properties of the field, clear value and emit events.
     *
     * @memberof DotSelectComponent
     */
    @Method()
    reset(): void {
        this.value = '';
        this.status = getOriginalStatus(this.isValid());
        this.emitValueChange();
        this.emitStatusChange();
    }

    render() {
        return (
            <Fragment>
                {getTagLabel(this.name, this.label)}
                {this._options.map((item: DotOption) => {
                    const trimmedValue = item.value.trim();
                    return (
                        <Fragment>
                            <input
                                class={getErrorClass(this.isValid())}
                                type='checkbox'
                                disabled={this.disabled || null}
                                id={this.value}
                                checked={this.value.indexOf(trimmedValue) >= 0 || null}
                                onInput={(event: Event) => this.setValue(event)}
                                value={trimmedValue}
                            />
                            <label htmlFor={trimmedValue}>{item.label}</label>
                        </Fragment>
                    );
                })}
                {getTagHint(this.hint)}
                {getTagError(!this.isValid(), this.requiredmessage)}
            </Fragment>
        );
    }

    // Todo: find how to set proper TYPE in TS
    private setValue(event): void {
        this.value = this.getValueFromCheckInputs(event.target.value.trim(), event.target.checked);
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        this.emitValueChange();
        this.emitStatusChange();
    }

    private getValueFromCheckInputs(value: string, checked: boolean): string {
        const valueArray = this.value.trim().length ? this.value.split(',') : [];
        const valuesSet = new Set(valueArray);
        if (checked) {
            valuesSet.add(value);
        } else {
            valuesSet.delete(value);
        }
        return Array.from(valuesSet).join(',');
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.status
        });
    }

    private isValid(): boolean {
        return this.required ? !!this.value : true;
    }

    private emitValueChange(): void {
        this.valueChange.emit({
            name: this.name,
            value: this.value
        });
    }
}
