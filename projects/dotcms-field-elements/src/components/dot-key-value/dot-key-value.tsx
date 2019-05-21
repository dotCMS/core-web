import {
    Component,
    Prop,
    State,
    Element,
    Event,
    EventEmitter,
    Method,
    Listen,
    Watch
} from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotFieldStatus,
    DotFieldValueEvent,
    DotFieldStatusEvent,
    DotKeyValueField
} from '../../models';
import {
    getClassNames,
    getOriginalStatus,
    getStringFromDotKeyArray,
    getTagError,
    getTagHint,
    updateStatus,
    checkProp
} from '../../utils';

const DEFAULT_VALUE = { key: '', value: '' };

@Component({
    tag: 'dot-key-value',
    styleUrl: 'dot-key-value.scss'
})
export class DotKeyValueComponent {
    @Element() el: HTMLElement;

    /** (optional) Placeholder for the key input text in the <dot-key-form> */
    @Prop() formKeyPlaceholder: string;

    /** (optional) Placeholder for the value input text in the <dot-key-form> */
    @Prop() formValuePlaceholder: string;

    /** (optional) The string to use in the key label in the <dot-key-form> */
    @Prop() formKeyLabel: string;

    /** (optional) The string to use in the value label in the <dot-key-form> */
    @Prop() formValueLabel: string;

    /** (optional) Label for the add button in the <dot-key-form> */
    @Prop() formAddButtonLabel: string;

    /** (optional) Disables field's interaction */
    @Prop() disabled = false;

    /** (optional) Hint text that suggest a clue of the field */
    @Prop() hint = '';

    /** (optional) Text to be rendered next to input field */
    @Prop() label = '';

    /** Name that will be used as ID */
    @Prop() name = '';

    /** (optional) Determine if it is mandatory */
    @Prop() required = false;

    /** (optional) Text that will be shown when required is set and condition is not met */
    @Prop() requiredMessage = '';

    /** Value of the field */
    @Prop({ mutable: true }) value = '';

    /** (optional) The string to use in the delete button of a key/value item */
    @Prop() buttonDeleteLabel: string;

    @Prop() fieldType = ''; // TODO: remove this prop and fix dot-form to use tagName

    @State() status: DotFieldStatus;
    @State() items: DotKeyValueField[] = [];

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    @State() fieldInput: DotKeyValueField = { ...DEFAULT_VALUE };

    @Watch('value')
    valueWatch(): void {
        this.value = checkProp<DotKeyValueComponent, string>(this, 'value', 'string');
        this.setItems();
    }

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.fieldInput = { key: '', value: '' };
        this.items = [];
        this.status = getOriginalStatus(this.isValid());
        this.emitChanges();
        this.clearForm();
    }

    @Listen('deleteItemEvt')
    deleteItemHandler(event: CustomEvent) {
        event.stopImmediatePropagation();

        this.items = this.items.filter((_item, internalIndex) => {
            return internalIndex !== event.detail;
        });
        this.refreshStatus();
        this.emitChanges();
    }

    @Listen('add')
    addItemHandler(event: CustomEvent<DotKeyValueField>): void {
        this.items = [...this.items, event.detail];
    }

    componentWillLoad(): void {
        this.validateProps();
        this.setOriginalStatus();
        this.emitStatusChange();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

    render() {
        return (
            <Fragment>
                <dot-label label={this.label} required={this.required} name={this.name}>
                    <dot-key-form
                        add-button-label={this.formAddButtonLabel}
                        disabled={this.isDisabled()}
                        key-label={this.formKeyLabel}
                        key-placeholder={this.formKeyPlaceholder}
                        value-label={this.formValueLabel}
                        value-placeholder={this.formValuePlaceholder}
                    />
                    {this.getKeyValueList()}
                </dot-label>
                {getTagHint(this.hint, this.name)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.valueWatch();
    }

    private isDisabled(): boolean {
        return this.disabled || null;
    }

    private getKeyValueList(): JSX.Element {
        return this.items.length ? (
            <key-value-table
                items={this.items}
                disabled={this.disabled}
                buttonDeleteLabel={this.buttonDeleteLabel}
            />
        ) : null;
    }

    private setItems(): void {
        this.items = this.value
            ? this.value
                  .split(',')
                  .filter((item) => item.length > 0)
                  .map((item) => {
                      const [key, value] = item.split('|');
                      return { key, value };
                  })
            : [];
    }

    private setOriginalStatus(): void {
        this.status = getOriginalStatus(this.isValid());
    }

    private isValid(): boolean {
        return !(this.required && !this.items.length);
    }

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isValid() ? '' : this.requiredMessage;
    }

    private refreshStatus(): void {
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.status
        });
    }

    private emitValueChange(): void {
        const returnedValue = getStringFromDotKeyArray(this.items);
        this.valueChange.emit({
            name: this.name,
            value: returnedValue,
            fieldType: this.fieldType
        });
    }

    private emitChanges(): void {
        this.emitStatusChange();
        this.emitValueChange();
    }

    private clearForm(): void {
        this.fieldInput = { ...DEFAULT_VALUE };
    }
}
