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
    DotKeyValueField,
    DotOption
} from '../../models';
import {
    checkProp,
    getClassNames,
    getDotOptionsFromFieldValue,
    getOriginalStatus,
    getStringFromDotKeyArray,
    getTagError,
    getTagHint,
    updateStatus
} from '../../utils';

const mapToKeyValue = ({ label, value }: DotOption) => {
    return {
        key: label,
        value
    };
};

@Component({
    tag: 'dot-key-value',
    styleUrl: 'dot-key-value.scss'
})
export class DotKeyValueComponent {
    @Element() el: HTMLElement;

    /** (optional) Placeholder for the key input text in the <key-value-form> */
    @Prop() formKeyPlaceholder: string;

    /** (optional) Placeholder for the value input text in the <key-value-form> */
    @Prop() formValuePlaceholder: string;

    /** (optional) The string to use in the key label in the <key-value-form> */
    @Prop() formKeyLabel: string;

    /** (optional) The string to use in the value label in the <key-value-form> */
    @Prop() formValueLabel: string;

    /** (optional) Label for the add button in the <key-value-form> */
    @Prop() formAddButtonLabel: string;

    /** (optional) The string to use in the delete button of a key/value item */
    @Prop() listDeleteLabel: string;

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
    @Prop() requiredMessage = 'This field is required';

    /** Value of the field */
    @Prop({ mutable: true }) value = '';

    @Prop() fieldType = ''; // TODO: remove this prop and fix dot-form to use tagName

    @State() status: DotFieldStatus;
    @State() items: DotKeyValueField[] = [];

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    @Watch('value')
    valueWatch(): void {
        this.value = checkProp<DotKeyValueComponent, string>(this, 'value', 'string');
        this.items = getDotOptionsFromFieldValue(this.value).map(mapToKeyValue);
    }

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.items = [];
        this.status = getOriginalStatus(this.isValid());
        this.emitChanges();
    }

    @Listen('delete')
    deleteItemHandler(event: CustomEvent<number>) {
        event.stopImmediatePropagation();

        this.items = this.items.filter(
            (_item: DotKeyValueField, index: number) => index !== event.detail
        );
        this.emitChanges();
    }

    @Listen('add')
    addItemHandler({ detail }: CustomEvent<DotKeyValueField>): void {
        this.items = [...this.items, detail];
        this.emitChanges();
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
                    <key-value-form
                        onInput={() => {
                            console.log('input');
                        }}
                        add-button-label={this.formAddButtonLabel}
                        disabled={this.disabled || null}
                        key-label={this.formKeyLabel}
                        key-placeholder={this.formKeyPlaceholder}
                        value-label={this.formValueLabel}
                        value-placeholder={this.formValuePlaceholder}
                    />
                    <key-value-table
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                        }}
                        button-label={this.listDeleteLabel}
                        disabled={this.disabled || null}
                        items={this.items}
                    />
                </dot-label>
                {getTagHint(this.hint)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.valueWatch();
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
        this.refreshStatus();
        this.emitStatusChange();
        this.emitValueChange();
    }
}
