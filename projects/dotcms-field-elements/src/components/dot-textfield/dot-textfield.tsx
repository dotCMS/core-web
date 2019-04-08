import { Component, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { generateId } from '../../utils';
import Fragment from 'stencil-fragment';

@Component({
    tag: 'dot-textfield',
    styleUrl: 'dot-textfield.scss'
})
export class DotTextfieldComponent {
    @Prop() value: string;
    @Prop() name: string;
    @Prop() regexcheck: string;
    @Prop() regexcheckmessage: string;
    @Prop() readOnly: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() placeholder: string;
    @Prop() required: boolean;
    @Prop() requiredmessage: string;
    @Prop() disabled: boolean;
    @Event() valueChanges: EventEmitter;
    @Event() statusChanges: EventEmitter;

    @State() _value: string;
    @State() _error = false;
    @State() _dotTouched = false;
    _dotPristine = true;

    _label: string;

    // tslint:disable-next-line:cyclomatic-complexity
    isValid(): boolean {
        if (this.required && this._value.length === 0) {
            return false;
        }

        if (this.regexcheck) {
            const regex = new RegExp(this.regexcheck, 'ig');
            return regex.test(this._value);
        }

        return true;
    }

    setTouched(): void {
        if (!this._dotTouched) {
            this._dotTouched = true;
            this.emitStatusChange();
        }
    }

    @Method()
    reset(): void {
        this._dotPristine = true;
        this._dotTouched = false;
        this._value = '';
        this._error = false;
        this.emitStatusChange();
    }

    // Todo: find how to set proper TYPE in TS
    setValue(event): void {
        this._value = event.target.value.toString();
        this._error = !this.isValid();
        if (this._dotPristine) {
            this._dotPristine = false;
            this._dotTouched = true;
        }
        this.valueChanges.emit({ error: this._error, value: this._value, name: this.name });
        this.emitStatusChange();
    }

    emitStatusChange(): void {
        this.statusChanges.emit({
            name: this.name,
            status: {
                dotTouched: this._dotTouched,
                dotValid: this.isValid(),
                dotPristine: this._dotPristine
            }
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    errorMessage(): string {
        return this.isValid()
            ? ''
            : this._dotPristine
              ? ''
              : this._value.length ? this.regexcheckmessage : this.requiredmessage;
    }

    componentWillLoad(): void {
        this._label = `dotTextfield_${generateId()}`;
        this._value = this._value && this._value.length > -1 ? this._value : this.value;
        this.emitStatusChange();
    }

    hostData() {
        this.emitStatusChange();
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

    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        return (
            <Fragment>
                <label htmlFor={this._label}>{this.label}</label>
                <input
                    class={this._error ? 'dot-textfield__input--error' : ''}
                    name={this._label}
                    type="text"
                    value={this._value}
                    placeholder={this.placeholder}
                    required={this.required ? true : null}
                    onInput={(event: Event) => this.setValue(event)}
                    onBlur={() => this.setTouched()}
                />
                {this.hint ? <span class="dot-textfield__hint">{this.hint}</span> : ''}
                {this.errorMessage() ? (
                    <span class="dot-textfield__error-meessage">{this.errorMessage()}</span>
                ) : (
                    ''
                )}
            </Fragment>
        );
    }
}
