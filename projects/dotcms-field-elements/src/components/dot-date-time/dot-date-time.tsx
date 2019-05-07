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
    DotFieldStatusClasses,
    DotFieldStatusEvent,
    DotFieldValueEvent,
    DotLabel
} from '../../models';
import { Components } from '../../components';
import DotInputCalendar = Components.DotInputCalendar;
import { getClassNames, getTagError, getTagHint, getTagLabel } from '../../utils';

const DATE_REGEX = new RegExp('(19|20)\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])');
const TIME_REGEX = new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$');

interface FormattedDate {
    date: string;
    time: string;
}

@Component({
    tag: 'dot-date-time',
    styleUrl: 'dot-date-time.scss'
})
export class DotDateTimeComponent {
    @Element() el: HTMLElement;
    @Prop({ mutable: true })
    value: string;
    @Prop() name: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() required: boolean;
    @Prop() requiredMessage: string;
    @Prop() validationMessage: string;
    @Prop() disabled = false;
    @Prop() min: string;
    @Prop() max: string;
    @Prop() step: string;

    @State() classNames: DotFieldStatusClasses;
    @State() errorMessageElement: JSX.Element;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    private _minDateTime: FormattedDate;
    private _maxDateTime: FormattedDate;
    private _value: FormattedDate;

    /**
     * Reset properties of the filed, clear value and emit events.
     */
    @Method()
    reset(): void {
        const inputs = this.el.querySelectorAll('dot-input-calendar');
        inputs.forEach((input: DotInputCalendar) => {
            input.reset();
        });
    }

    @Listen('_valueChange')
    emitValueChange(event: CustomEvent) {
        const statusEvent: DotFieldValueEvent = event.detail;
        event.stopImmediatePropagation();
        if (statusEvent.name.indexOf('-date') > 0) {
            this._value.date = statusEvent.value;
        } else {
            this._value.time = statusEvent.value;
        }
        debugger;
        this.valueChange.emit({ name: this.name, value: this.getValue() });
    }

    @Listen('_statusChange')
    emitStatusChange(event: CustomEvent) {
        event.stopImmediatePropagation();
        const statusEvent: DotFieldStatusEvent = event.detail;
        this.classNames = getClassNames(
            statusEvent.status,
            statusEvent.status.dotValid,
            this.required
        );
        this.statusChange.emit(event.detail);
    }

    @Listen('_errorMessage')
    showErrorElement(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.errorMessageElement = getTagError(event.detail.show, this.validationMessage);
    }

    componentWillLoad() {
        this.setDatesFormat();
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
                    name={this.name + '-date'}
                    hint={this.hint}
                    value={this._value.date}
                    required={this.required}
                    required-message={this.requiredMessage}
                    validation-message={this.validationMessage}
                    min={this._minDateTime.date}
                    max={this._maxDateTime.date}
                    step={this.parseStep[0]}
                />
                <dot-input-calendar
                    disabled={this.disabled}
                    type="time"
                    name={this.name + '-time'}
                    hint={this.hint}
                    value={this._value.time}
                    required={this.required}
                    required-message={this.requiredMessage}
                    validation-message={this.validationMessage}
                    min={this._minDateTime.time}
                    max={this._maxDateTime.time}
                    step={this.parseStep[1]}
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

    private parseDate(data: string): FormattedDate {
        const value: FormattedDate = {
            date: null,
            time: null
        };
        if (data.length) {
            const date = data.split(' ');
            if (date.length > 1) {
                value.date = this.validateDate(date[0]);
                value.time = this.validateTime(date[1]);
            } else {
                value.date = this.validateDate(date[0]);
                value.time = this.validateTime(date[0]);
            }
        }
        return value;
    }

    private parseStep(): string[] {
        return this.step.split(' ');
    }

    private validateDate(date: string): string {
        return DATE_REGEX.test(date) ? date : null;
    }

    private validateTime(time: string): string {
        return TIME_REGEX.test(time) ? time : null;
    }

    private getValue(): string {
        return this._value.date + ' ' + this._value.time;
    }
}
