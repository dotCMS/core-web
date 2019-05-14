import { Component, Prop, State, Element, Event, EventEmitter, Method, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldValueEvent, DotFieldStatusEvent, DotLabel } from '../../models';
import {
    getClassNames,
    getErrorClass,
    getId,
    getOriginalStatus,
    getTagError,
    getTagHint,
    getTagLabel,
    updateStatus
} from '../../utils';
import { dotPropValidator } from '../../utils/errorHandling';

@Component({
    tag: 'dot-textfield',
    styleUrl: 'dot-textfield.scss'
})
export class DotTextfieldComponent {
    @Element() el: HTMLElement;
    @Prop({ mutable: true })
    disabled = false;
    @Prop() hint = '';
    @Prop({ mutable: true })
    label = '';
    @Prop() name = '';
    @Prop() placeholder = '';
    @Prop() regexCheck = null;
    @Prop() required = false;
    @Prop() requiredMessage = '';
    @Prop() type = 'text';
    @Prop() validationMessage = '';
    @Prop({ mutable: true })
    value = '';

    fieldAttr = {
        type: 'dot-textfield',
        name: this.name
    };

    @State() status: DotFieldStatus;

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
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
        this.validateProps();
    }

    @Watch('disabled')
    disabledWatch(_newValue: boolean, oldValue: boolean): void {
        this.disabled = dotPropValidator(
            {
                field: { ...this.fieldAttr },
                name: 'disabled',
                value: this.disabled
            },
            oldValue
        );
    }

    @Watch('label')
    labelWatch(_newValue: string, oldValue: string): void {
        this.label = dotPropValidator(
            {
                field: { ...this.fieldAttr },
                name: 'label',
                value: this.label
            },
            oldValue
        );
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

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
                    id={getId(this.name)}
                    onBlur={() => this.blurHandler()}
                    onInput={(event: Event) => this.setValue(event)}
                    placeholder={this.placeholder}
                    required={this.required || null}
                    type={this.type}
                    value={this.value}
                />
                {getTagHint(this.hint)}
                {getTagError(this.shouldShowErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.disabledWatch(null, this.disabled);
        this.labelWatch(null, this.label);
    }

    private isValid(): boolean {
        return !this.isValueRequired() && this.isRegexValid();
    }

    private isValueRequired(): boolean {
        return this.required && !this.value;
    }

    private isRegexValid(): boolean {
        if (this.regexCheck && this.value) {
            const regex = new RegExp(this.regexCheck, 'ig');
            return regex.test(this.value);
        }
        return true;
    }

    private shouldShowErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isRegexValid()
            ? this.isValid() ? '' : this.requiredMessage
            : this.validationMessage;
    }

    private blurHandler(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setValue(event): void {
        this.value = event.target.value.toString();
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
