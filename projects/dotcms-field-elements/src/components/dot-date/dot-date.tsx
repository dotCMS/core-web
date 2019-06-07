import {
    Component,
    Element,
    Event,
    EventEmitter,
    Listen,
    Method,
    Prop,
    State,
    Watch
} from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotFieldStatusClasses,
    DotFieldValueEvent,
    DotInputCalendarStatusEvent
} from '../../models';
import { checkProp, getClassNames, getTagError, getTagHint } from '../../utils';

@Component({
    tag: 'dot-date',
    styleUrl: 'dot-date.scss'
})
export class DotDateComponent {
    @Element() el: HTMLElement;

    /** Value format yyyy-mm-dd  e.g., 2005-12-01 */
    @Prop({ mutable: true, reflectToAttr: true })
    value = '';

    /** Name that will be used as ID */
    @Prop({ reflectToAttr: true })
    name = '';

    /** (optional) Text to be rendered next to input field */
    @Prop({ reflectToAttr: true })
    label = '';

    /** (optional) Hint text that suggest a clue of the field */
    @Prop({ reflectToAttr: true })
    hint = '';

    /** (optional) Determine if it is mandatory */
    @Prop({ reflectToAttr: true })
    required = false;

    /** (optional) Text that be shown when required is set and condition not met */
    @Prop({ reflectToAttr: true })
    requiredMessage = 'This field is required';

    /** (optional) Text that be shown when min or max are set and condition not met */
    @Prop({ reflectToAttr: true })
    validationMessage = "The field doesn't comply with the specified format";

    /** (optional) Disables field's interaction */
    @Prop({ reflectToAttr: true })
    disabled = false;

    /** (optional) Min, minimum value that the field will allow to set. Format should be yyyy-mm-dd */
    @Prop({ mutable: true, reflectToAttr: true })
    min = '';

    /** (optional) Max, maximum value that the field will allow to set. Format should be yyyy-mm-dd */
    @Prop({ mutable: true, reflectToAttr: true })
    max = '';

    /** (optional) Step specifies the legal number intervals for the input field */
    @Prop({ reflectToAttr: true })
    step = '1';

    @State() classNames: DotFieldStatusClasses;
    @State() errorMessageElement: JSX.Element;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotInputCalendarStatusEvent>;

    /**
     * Reset properties of the field, clear value and emit events.
     */
    @Method()
    reset(): void {
        const input = this.el.querySelector('dot-input-calendar');
        input.reset();
    }

    componentWillLoad(): void {
        this.validateProps();
    }

    @Watch('min')
    minWatch(): void {
        this.min = checkProp<DotDateComponent, string>(this, 'min', 'date');
    }

    @Watch('max')
    maxWatch(): void {
        this.max = checkProp<DotDateComponent, string>(this, 'max', 'date');
    }

    @Listen('_valueChange')
    emitValueChange(event: CustomEvent) {
        event.stopImmediatePropagation();
        const valueEvent: DotFieldValueEvent = event.detail;
        this.value = valueEvent.value;
        this.valueChange.emit(valueEvent);
    }

    @Listen('_statusChange')
    emitStatusChange(event: CustomEvent) {
        event.stopImmediatePropagation();
        const statusEvent: DotInputCalendarStatusEvent = event.detail;
        this.classNames = getClassNames(
            statusEvent.status,
            statusEvent.status.dotValid,
            this.required
        );
        this.setErrorMessageElement(statusEvent);
        this.statusChange.emit(event.detail);
    }

    hostData() {
        return {
            class: this.classNames
        };
    }

    render() {
        return (
            <Fragment>
                <dot-label label={this.label} required={this.required} name={this.name}>
                    <dot-input-calendar
                        disabled={this.disabled}
                        type="date"
                        name={this.name}
                        value={this.value}
                        required={this.required}
                        min={this.min}
                        max={this.max}
                        step={this.step}
                    />
                </dot-label>
                {getTagHint(this.hint)}
                {this.errorMessageElement}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.minWatch();
        this.maxWatch();
    }

    private setErrorMessageElement(statusEvent: DotInputCalendarStatusEvent) {
        this.errorMessageElement = getTagError(
            !statusEvent.status.dotValid && !statusEvent.status.dotPristine,
            this.getErrorMessage(statusEvent)
        );
    }

    private getErrorMessage(statusEvent: DotInputCalendarStatusEvent): string {
        return !!this.value
            ? statusEvent.inValidRange ? '' : this.validationMessage
            : this.requiredMessage;
    }
}
