import { Component, Prop, State, Event, EventEmitter, Method, Element } from '@stencil/core';
import Fragment from 'stencil-fragment';

@Component({
    tag: 'dot-textfield',
    styleUrl: 'dot-textfield.scss'
})
export class DotTextfieldComponent {
    @Prop({ mutable: true })
    value: string;
    @Prop() name: string;
    @Prop() regexcheck: string;
    @Prop() regexcheckmessage: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() placeholder: string;
    @Prop() required: boolean;
    @Prop() requiredmessage: string;
    @Prop() disabled = false;
    @Event() valueChanges: EventEmitter;
    @Event() statusChanges: EventEmitter;

    @State() _valid = true;
    @State() _dotTouched = false;
    _dotPristine = true;


    @Element() el: HTMLElement;

    isValid(): boolean {
        return !this.isValueRequired() && this.isRegexValid();
    }

    isValueRequired(): boolean {
        return this.required && !this.value.length;
    }

    /**
     * Check if there is Regular Expresion to validate, otherwise return true.
     */
    isRegexValid(): boolean {
        if (this.regexcheck && this.value.length) {
            const regex = new RegExp(this.regexcheck, 'ig');
            return regex.test(this.value);
        }
        return true;
    }

    blurHandler(): void {
        if (!this._dotTouched) {
            this._dotTouched = true;
            this.emitStatusChange();
        }
    }

    @Method()
    reset(): void {
        this._dotPristine = true;
        this._dotTouched = false;
        this.value = '';
        this._valid = true;
        this.emitStatusChange();
    }

    // Todo: find how to set proper TYPE in TS
    setValue(event): void {
        this._dotPristine = false;
        this._dotTouched = true;
        this.value = event.target.value.toString();
        this._valid = this.isValid();
        this.valueChanges.emit({
            target: this.el,
            status: this.getStatus()
        });
        this.emitStatusChange();
    }

    emitStatusChange(): void {
        this.statusChanges.emit({
            target: this.el,
            status: this.getStatus()
        });
    }

    getStatus() {
        return {
            dotTouched: this._dotTouched,
            dotValid: this.isValid(),
            dotPristine: this._dotPristine
        };
    }

    errorMessage(): string {
        return this.isRegexValid()
            ? this.isValid() ? '' : this.requiredmessage
            : this.regexcheckmessage;
    }

    componentWillLoad(): void {
        this.emitStatusChange();
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

    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        return (
            <Fragment>
                <label>{this.label}</label>
                <input
                    class={this._valid ? '' : 'dot-textfield__input--error'}
                    name={this.name}
                    type='text'
                    value={this.value}
                    placeholder={this.placeholder}
                    required={this.required ? true : null}
                    onInput={(event: Event) => this.setValue(event)}
                    onBlur={() => this.blurHandler()}
                    disabled={this.disabled ? true : null}
                />
                {this.hint ? <span class='dot-textfield__hint'>{this.hint}</span> : ''}
                {this.errorMessage() && !this._dotPristine ? (
                    <span class='dot-textfield__error-meessage'>{this.errorMessage()}</span>
                ) : (
                    ''
                )}
            </Fragment>
        );
    }
}
