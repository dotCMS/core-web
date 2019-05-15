import {
    Component,
    Element,
    Event,
    EventEmitter,
    Listen,
    Method,
    Prop,
    State
} from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotFieldStatus,
    DotFieldStatusClasses,
    DotFieldStatusEvent,
    DotFieldValueEvent,
    DotLabel
} from '../../models';
import { Components } from '../../components';
import DotInputCalendar = Components.DotInputCalendar;
import {
    DATE_REGEX,
    getClassNames,
    getTagError,
    getTagHint,
    getTagLabel,
    TIME_REGEX
} from '../../utils';

const DATE_SUFFIX = '-date';
const TIME_SUFFIX = '-time';

interface DateSlots {
    date: string;
    time: string;
}

@Component({
    tag: 'dot-date-time',
    styleUrl: 'dot-date-time.scss'
})
export class DotDateTimeComponent {
    @Element() el: HTMLElement;

    /** Value should be year-month-day hour:minute:second e.g., 2005-12-01 15:22:00 */
    @Prop({ mutable: true })
    value = '';

    /** Name that will be used as ID */
    @Prop() name = '';

    /** (optional) Text to be rendered next to input field */
    @Prop() label = '';

    /** (optional) Hint text that suggest a clue of the field */
    @Prop() hint = '';

    /** (optional) Determine if it is needed */
    @Prop() required = false;

    /** (optional) Text that be shown when required is set and condition not met */
    @Prop() requiredMessage = '';

    /** (optional) Text that be shown when min or max are set and condition not met */
    @Prop() validationMessage = '';

    /** (optional) Disables field's interaction */
    @Prop() disabled = false;

    /** (optional) Min value that the field will allow to set. Format should be year-month-day hour:minute:second | year-month-day | hour:minute:second */
    @Prop() min = '';

    /** (optional) Max value that the field will allow to set. Format should be year-month-day hour:minute:second | year-month-day | hour:minute:second */
    @Prop() max = '';

    /** (optional) Step that are indicated for the date and time input's separates by a comma (2,10) */
    @Prop() step = '';

    @State() classNames: DotFieldStatusClasses;
    @State() errorMessageElement: JSX.Element;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    private _minDateTime: DateSlots;
    private _maxDateTime: DateSlots;
    private _value: DateSlots;
    private _step: DateSlots;
    private _status = {
        date: null,
        time: null
    };

    /**
     * Reset properties of the filed, clear value and emit events.
     */
    @Method()
    reset(): void {
        this._status.date = null;
        this._status.time = null;
        const inputs = this.el.querySelectorAll('dot-input-calendar');
        inputs.forEach((input: DotInputCalendar) => {
            input.reset();
        });
        this.valueChange.emit({ name: this.name, value: '' });
    }

    @Listen('_valueChange')
    emitValueChange(event: CustomEvent) {
        const valueEvent: DotFieldValueEvent = event.detail;
        event.stopImmediatePropagation();
        this.setValue(valueEvent);
        if (this.isValueComplete()) {
            this.valueChange.emit({ name: this.name, value: this.getValue() });
        }
    }

    @Listen('_statusChange')
    emitStatusChange(event: CustomEvent) {
        const statusEvent: DotFieldStatusEvent = event.detail;
        let status: DotFieldStatus;
        event.stopImmediatePropagation();
        this.setStatus(statusEvent);
        if (this.isStatusComplete()) {
            status = this.statusHandler();
            this.classNames = getClassNames(status, status.dotValid, this.required);
            this.statusChange.emit({ name: this.name, status: status });
        }
    }

    @Listen('_errorMessage')
    showErrorElement(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.errorMessageElement = getTagError(event.detail.show, this.validationMessage);
    }

    componentWillLoad() {
        this.setDatesFormat();
        [this._step.date, this._step.time] = this.step.split(',');
    }

    hostData() {
        return {
            class: this.classNames
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
                <dot-input-calendar
                    disabled={this.disabled}
                    type="date"
                    name={this.name + DATE_SUFFIX}
                    hint={this.hint}
                    value={this._value.date}
                    required={this.required}
                    required-message={this.requiredMessage}
                    validation-message={this.validationMessage}
                    min={this._minDateTime.date}
                    max={this._maxDateTime.date}
                    step={this._step.date}
                />
                <dot-input-calendar
                    disabled={this.disabled}
                    type="time"
                    name={this.name + TIME_SUFFIX}
                    hint={this.hint}
                    value={this._value.time}
                    required={this.required}
                    required-message={this.requiredMessage}
                    validation-message={this.validationMessage}
                    min={this._minDateTime.time}
                    max={this._maxDateTime.time}
                    step={this._step.time}
                />
                {getTagHint(this.hint)}
                {this.errorMessageElement}
            </Fragment>
        );
    }

    private setDatesFormat(): void {
        this._minDateTime = this.parseDate(this.min);
        this._maxDateTime = this.parseDate(this.max);
        this._value = this.parseDate(this.value);
    }

    private parseDate(data: string): DateSlots {
        const [dateOrTime, time] = data.split(' ');
        return {
            date: this.validateDate(dateOrTime),
            time: this.validateTime(time) || this.validateTime(dateOrTime)
        };
    }

    private validateDate(date: string): string {
        return DATE_REGEX.test(date) ? date : null;
    }

    private validateTime(time: string): string {
        return TIME_REGEX.test(time) ? time : null;
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private statusHandler(): DotFieldStatus {
        return {
            dotTouched: this._status.date.dotTouched || this._status.time.dotTouched,
            dotValid: this._status.date.dotValid && this._status.time.dotValid,
            dotPristine: this._status.date.dotPristine && this._status.time.dotPristine
        };
    }

    private getValue(): string {
        return this._value.date && this._value.time
            ? `${this._value.date} ${this._value.time}`
            : '';
    }

    private setValue(event: DotFieldValueEvent) {
        if (event.name.indexOf(DATE_SUFFIX) > 0) {
            this._value.date = event.value;
        } else {
            this._value.time = event.value;
        }
    }

    private setStatus(event: DotFieldStatusEvent) {
        if (event.name.indexOf(DATE_SUFFIX) > 0) {
            this._status.date = event.status;
        } else {
            this._status.time = event.status;
        }
    }

    private isValueComplete(): boolean {
        return !!this._value.time && !!this._value.date;
    }

    private isStatusComplete(): boolean {
        return this._status.date && this._status.time;
    }
}
