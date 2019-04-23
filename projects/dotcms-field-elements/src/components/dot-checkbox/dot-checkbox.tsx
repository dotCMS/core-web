import { Component, Prop, State, Event, Element, EventEmitter, Method } from '@stencil/core';
import { getDotOptionsFromFieldValue } from '../../utils';
import { DotOption } from '../../models/dot-option.model';
import Fragment from 'stencil-fragment';
import { DotFieldStatus } from '../../models/dot-field-status.model';

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

    @Event() valueChange: EventEmitter;
    @Event() statusChange: EventEmitter;

    @State() _options: DotOption[];
    @State() _valid = true;
    _dotTouched = false;
    _dotPristine = true;

    componentWillLoad() {
        this._options = getDotOptionsFromFieldValue(this.options);
    }

    hostData() {
        return {
            class: {
                'dot-valid': this.isValid(),
                'dot-invalid': !this.isValid(),
                'dot-pristine': this._dotPristine,
                'dot-dirty': !this._dotPristine,
                'dot-touched': this._dotTouched,
                'dot-untouched': !this._dotTouched
            }
        };
    }

    /**
     * Reset properties of the field, clear value and emit events.
     *
     * @memberof DotSelectComponent
     */
    @Method()
    reset(): void {
        this._dotPristine = true;
        this._dotTouched = false;
        this._valid = true;
        this.value = '';
        this.emitValueChange();
        this.emitStatusChange();
    }

    render() {
        return (
            <Fragment>
                <label htmlFor={this.name}>{this.label}</label>
                {this._options.map((item: DotOption) => {
                    const trimmedValue = item.value.trim();
                    return (
                        <div class={this.getClassName()}>
                            <input
                                type='checkbox'
                                disabled={this.shouldBeDisabled()}
                                id={this.value}
                                checked={this.value.indexOf(trimmedValue) >= 0 ? true : null}
                                onInput={(event: Event) => this.setValue(event)}
                                value={trimmedValue}
                            />
                            <label htmlFor={trimmedValue}>{item.label}</label>
                        </div>
                    );
                })}
                {this.hint ? <span class='dot-field__hint'>{this.hint}</span> : ''}
                {!this.isValid() ? <span class='dot-field__error-message'>{this.requiredmessage}</span> : ''}
            </Fragment>
        );
    }

    // Todo: find how to set proper TYPE in TS
    private setValue(event): void {
        this._dotPristine = false;
        this._dotTouched = true;
        this.value = this.getValueFromCheckInputs(event.target.value.trim(), event.target.checked);
        this.emitValueChange();
        this.emitStatusChange();
    }

    private getValueFromCheckInputs(value: string, checked: boolean): string {
        const valueArray = this.value.trim().length > 0 ? this.value.split(',') : [];
        const valuesSet = new Set(valueArray);
        if (checked) {
            valuesSet.add(value);
        } else {
            valuesSet.delete(value);
        }
        return Array.from(valuesSet).join(',');
    }

    private getClassName(): string {
        return this.isValid() ? '' : 'dot-field__error';
    }

    private shouldBeDisabled(): boolean {
        return this.disabled ? true : null;
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.getStatus()
        });
    }

    private getStatus(): DotFieldStatus {
        return {
            dotTouched: this._dotTouched,
            dotValid: this.isValid(),
            dotPristine: this._dotPristine
        };
    }

    private isValid(): boolean {
        return this.required ? !!this.value : true;
    }

    private emitValueChange(): void {
        this.valueChange.emit({ name: this.name, value: this.value });
    }
}
