import {Component, Prop, State, Method, Element, Event, EventEmitter, Watch} from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldValueEvent, DotFieldStatusEvent, DotLabel } from '../../models';
import {
    getClassNames,
    getOriginalStatus,
    getTagHint,
    getTagError,
    getTagLabel,
    getErrorClass,
    updateStatus,
    getId, dotPropValidator
} from '../../utils';

const REGEX_DEFAULT_VALUE = '';

/**
 * Represent a dotcms textarea control.
 *
 * @export
 * @class DotTextareaComponent
 */
@Component({
    tag: 'dot-textarea',
    styleUrl: 'dot-textarea.scss'
})
export class DotTextareaComponent {
    @Element() el: HTMLElement;
    @Prop() disabled = false;
    @Prop() hint = '';
    @Prop() label = '';
    @Prop() name = '';
    @Prop({ mutable: true })
    regexCheck = '';
    @Prop() required = false;
    @Prop() requiredMessage = '';
    @Prop() validationMessage = '';
    @Prop({ mutable: true })
    value = '';

    @State() status: DotFieldStatus = getOriginalStatus();

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    private fieldAttr = {
        type: 'dot-textarea',
        name: ''
    };

    /**
     * Reset properties of the field, clear value and emit events.
     *
     * @memberof DotTextareaComponent
     */
    @Method()
    reset(): void {
        this.value = '';
        this.status = getOriginalStatus(this.isValid());
        this.emitStatusChange();
        this.emitValueChange();
    }

    componentWillLoad(): void {
        this.fieldAttr.name = this.name;
        this.validateProps();
        this.emitStatusChange();
    }

    @Watch('regexCheck')
    regexCheckWatch(): void {
        this.regexCheck =
            dotPropValidator({
                field: { ...this.fieldAttr },
                name: 'regexCheck',
                value: this.regexCheck
            }) || REGEX_DEFAULT_VALUE;
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
                <textarea
                    class={getErrorClass(this.status.dotValid)}
                    id={getId(this.name)}
                    name={this.name}
                    value={this.value}
                    required={this.getRequiredAttr()}
                    onInput={(event: Event) => this.setValue(event)}
                    onBlur={() => this.blurHandler()}
                    disabled={this.getDisabledAtt()}
                />
                {getTagHint(this.hint)}
                {getTagError(this.shouldShowErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.regexCheckWatch();
    }

    private getDisabledAtt(): boolean {
        return this.disabled || null;
    }

    private getRequiredAttr(): boolean {
        return this.required ? true : null;
    }

    private isValid(): boolean {
        return !this.isValueRequired() && this.isRegexValid();
    }

    private isValueRequired(): boolean {
        return this.required && !this.value.length;
    }

    private isRegexValid(): boolean {
        if (this.regexCheck && this.value.length) {
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
