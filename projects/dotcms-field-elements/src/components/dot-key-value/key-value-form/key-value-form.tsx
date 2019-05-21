import { Component, Prop, State, Element, Event, EventEmitter } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotKeyValueField } from '../../../models';

const DEFAULT_VALUE = { key: '', value: '' };

@Component({
    tag: 'key-value-form',
    styleUrl: 'key-value-form.scss'
})
export class DotKeyValueComponent {
    @Element() el: HTMLElement;

    /** (optional) Disables all form interaction */
    @Prop() disabled = false;

    /** (optional) Label for the add item button */
    @Prop() addButtonLabel = 'Add';

    /** (optional) Placeholder for the key input text */
    @Prop() keyPlaceholder = null;

    /** (optional) Placeholder for the value input text */
    @Prop() valuePlaceholder = null;

    /** (optional) The string to use in the key input label */
    @Prop() keyLabel = 'Key';

    /** (optional) The string to use in the value input label */
    @Prop() valueLabel = 'Value';

    /** Emit the added value, key/value pair */
    @Event() add: EventEmitter<DotKeyValueField>;

    @State() value: DotKeyValueField = { ...DEFAULT_VALUE };

    render() {
        const buttonDisabled = this.isButtonDisabled();
        return (
            <Fragment>
                <form onSubmit={this.addKey.bind(this)}>
                    <label>
                        {this.keyLabel}
                        <input
                            disabled={this.isDisabled()}
                            name="key"
                            onInput={(event: Event) => this.setValue(event)}
                            placeholder={this.keyPlaceholder}
                            type="text"
                            value={this.value.key}
                        />
                    </label>
                    <label>
                        {this.valueLabel}
                        <input
                            disabled={this.isDisabled()}
                            name="value"
                            onInput={(event: Event) => this.setValue(event)}
                            placeholder={this.valuePlaceholder}
                            type="text"
                            value={this.value.value}
                        />
                    </label>
                    <button
                        class="key-value-form__save__button"
                        type="submit"
                        disabled={buttonDisabled}
                    >
                        {this.addButtonLabel}
                    </button>
                </form>
            </Fragment>
        );
    }

    private isButtonDisabled(): boolean {
        return !this.isFormValid() || (this.disabled || null);
    }

    private isFormValid(): boolean {
        return !!this.value.key && !!this.value.value;
    }

    private isDisabled(): boolean {
        return this.disabled || null;
    }

    private setValue(event: Event): void {
        event.stopImmediatePropagation();

        const target = event.target as HTMLInputElement;
        this.value = {
            ...this.value,
            [target.name]: target.value.toString()
        };
    }

    private addKey(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (this.value.key && this.value.value) {
            this.add.emit(this.value);
            this.clearForm();
            this.focusFirstField();
        }
    }

    private clearForm(): void {
        this.value = { ...DEFAULT_VALUE };
    }

    private focusFirstField(): void {
        const input: HTMLInputElement = this.el.querySelector('input[name="key"]');
        input.focus();
    }
}
