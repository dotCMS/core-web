import { Component, Element, Event, EventEmitter, Method, Prop, State } from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotFieldStatus,
    DotFieldStatusEvent,
    DotFieldValueEvent,
    DotOption,
    DotLabel
} from '../../models';
import {
    getClassNames,
    getDotOptionsFromFieldValue,
    getErrorClass,
    getOriginalStatus,
    getTagError,
    getTagHint,
    getTagLabel,
    updateStatus
} from '../../utils';

@Component({
    tag: 'dot-radio',
    styleUrl: 'dot-radio.scss'
})
export class DotRadioComponent {
    @Element() el: HTMLElement;

    @Prop({ mutable: true })
    value: string;
    @Prop() name: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() required: boolean;
    @Prop() disabled = false;
    @Prop() requiredMessage: string;
    @Prop() options: string;

    @State() _options: DotOption[];
    @State() status: DotFieldStatus = getOriginalStatus();

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.value = '';
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
        this.emitValueChange();
    }

    componentWillLoad(): void {
        this._options = getDotOptionsFromFieldValue(this.options);
        this.emitStatusChange();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

    render() {
        let labelTagParams: DotLabel = {
            name: this.name,
            label: this.label,
            required: this.required
        };
        return (
            <Fragment>
                {getTagLabel(labelTagParams)}
                <div
                    tabIndex={0}
                    class="dot-radio__items"
                    role="radiogroup"
                    aria-labelledby={`label-${labelTagParams.name}`}
                    aria-describedby={`hint-${this.name}`}
                >
                    {this._options.map((item: DotOption) => {
                        labelTagParams = {
                            name: 'dot-radio-' + item.label.toLocaleLowerCase(),
                            label: item.label
                        };
                        return (
                            <label>
                                <input
                                    checked={this.value.indexOf(item.value) >= 0 || null}
                                    class={getErrorClass(this.isValid())}
                                    disabled={this.disabled || null}
                                    name={this.name.toLocaleLowerCase()}
                                    onInput={(event: Event) => this.setValue(event)}
                                    type="radio"
                                    value={item.value}
                                />
                                {item.label}
                            </label>
                        );
                    })}
                </div>
                {getTagHint(this.hint, this.name)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private isValid(): boolean {
        return this.required ? !!this.value : true;
    }

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isValid() ? '' : this.requiredMessage;
    }

    private setValue(event): void {
        this.value = event.target.value.trim();
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        this.emitValueChange();
        this.emitStatusChange();
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.status
        });
    }

    private emitValueChange(): void {
        this.valueChange.emit({
            name: this.name,
            value: this.value
        });
    }
}
