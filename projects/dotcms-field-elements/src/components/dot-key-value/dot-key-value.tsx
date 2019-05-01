import {
    Component,
    Prop,
    State,
    Element,
    Event,
    EventEmitter,
    Method,
    Listen
} from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotFieldStatus,
    DotFieldValueEvent,
    DotFieldStatusEvent,
    DotLabel,
    KeyValue
} from '../../models';
import {
    getClassNames,
    getOriginalStatus,
    getTagHint,
    getTagError,
    getTagLabel,
    getErrorClass,
    updateStatus
} from '../../utils';

@Component({
    tag: 'dot-key-value',
    styleUrl: 'dot-key-value.scss'
})
export class DotKeyValueComponent {
    @Element() el: HTMLElement;
    @Prop({ mutable: true }) value: string;
    @Prop() name: string;
    @Prop() fieldType: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() keyPlaceholder: string;
    @Prop() valuePlaceholder: string;
    @Prop() required: boolean;
    @Prop() requiredmessage: string;
    @Prop() saveBtnLabel = 'Add';
    @Prop() disabled = false;

    @State() status: DotFieldStatus;
    @State() keyValues: KeyValue[] = [];

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    fieldInput: KeyValue = { key: '', value: '' };

    /**
     * Reset properties of the filed, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.fieldInput = { key: '', value: '' };
        this.keyValues = [];
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
        this.emitValueChange();
    }

    @Listen('deleteKeyValue')
    deleteKeyHandler(event: CustomEvent) {
        this.keyValues = this.keyValues.filter((_item, internalIndex) => {
            return internalIndex !== event.detail;
        });
        this.refreshStatus();
        this.emitStatusChange();
        this.emitValueChange();
    }

    componentWillLoad(): void {
        this.setInitialValue();
        this.emitStatusChange();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

    // tslint:disable-next-line:cyclomatic-complexity
    render() {
        const labelTagParams: DotLabel = {
            name: this.name,
            label: this.label,
            required: this.required
        };
        return (
            <Fragment>
                {getTagLabel(labelTagParams)}
                <input
                    class={getErrorClass(this.status.dotValid)}
                    disabled={this.disabled || null}
                    id={this.name}
                    name="key"
                    onInput={(event: Event) => this.setValue(event)}
                    placeholder={this.keyPlaceholder}
                    type="text"
                    value={this.fieldInput.key}
                />
                <input
                    class={getErrorClass(this.status.dotValid)}
                    disabled={this.disabled || null}
                    name="value"
                    onInput={(event: Event) => this.setValue(event)}
                    placeholder={this.valuePlaceholder}
                    type="text"
                    value={this.fieldInput.value}
                />
                <button
                    type="button"
                    disabled={this.disabled || null}
                    onClick={() => this.addKey()}
                >
                    {this.saveBtnLabel}
                </button>
                {this.keyValues.length ? (
                    <key-value-table keyValues={this.keyValues} disabled={this.disabled} />
                ) : (
                    ''
                )}
                {getTagHint(this.hint)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private setInitialValue(): void {
        this.keyValues = this.value
            ? this.value
                  .split(',')
                  .filter((item) => item.length > 0)
                  .map((item) => {
                      const [key, value] = item.split('|');
                      return { key, value };
                  })
            : [];
        this.status = getOriginalStatus(this.isValid());
    }

    private isValid(): boolean {
        return !(this.required && !this.keyValues.length);
    }

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isValid() ? '' : this.requiredmessage;
    }

    private setValue(event): void {
        this.fieldInput[event.target.name] = event.target.value.toString();
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
        const returnedValue = this.keyValues
            .map((item: KeyValue) => {
                return `${item.key}|${item.value}`;
            })
            .join(',');

        this.valueChange.emit({
            name: this.name,
            value: returnedValue,
            fieldType: this.fieldType
        });
    }

    private addKey(): void {
        if (this.fieldInput.key && this.fieldInput.value) {
            this.keyValues = [
                ...this.keyValues,
                {
                    key: this.fieldInput.key,
                    value: this.fieldInput.value
                }
            ];
            this.refreshStatus();
            this.emitStatusChange();
            this.emitValueChange();
        }
    }
}
