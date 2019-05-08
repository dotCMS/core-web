import { Component, Prop, State, Element, Event, EventEmitter, Method } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldValueEvent, DotFieldStatusEvent, DotLabel } from '../../models';
import { getClassNames, getOriginalStatus, updateStatus, getTagLabel, getTagHint, getErrorClass, getTagError } from '../../utils';
import flatpickr from 'flatpickr';

@Component({
    tag: 'dot-date-range',
    styleUrl: 'dot-date-range.scss'
})
export class DotDateRangeComponent {
    @Element() el: HTMLElement;
    @Prop({ mutable: true }) value = '';
    @Prop() name: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() max: string;
    @Prop() min: string;
    @Prop() required: boolean;
    @Prop() requiredMessage: string;
    @Prop() disabled = false;

    @State() status: DotFieldStatus;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    fp: any;
    presets = [
        {
            label: 'Date Presets',
            time: 0
        }, {
            label: 'Last Week',
            time: -7
        }, {
            label: 'Next Week',
            time: 7
        }, {
            label: 'Last Month',
            time: -30
        }, {
            label: 'Next Month',
            time: 30
        }
    ];

    /**
     * Reset properties of the filed, clear value and emit events.
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
    }

    componentDidLoad(): void {
        this.fp = flatpickr(`#${this.name}`, {
            mode: 'range',
            dateFormat: 'Y-m-d',
            defaultDate: this.value ? this.value.split(',') : '',
            maxDate: this.max,
            minDate: this.min,
            onChange: this.setValue.bind(this),
        });
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

    render() {
        const labelTagParams: DotLabel = {name: this.name, label: this.label, required: this.required};
        return (
            <Fragment>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
                />
                {getTagLabel(labelTagParams)}
                <input
                    class={getErrorClass(this.status.dotValid)}
                    disabled={this.disabled || null}
                    id={this.name}
                    required={this.required || null}
                    type='text'
                    value={this.value}
                />
                <select onChange={this.setPreset.bind(this)}>
                    {this.presets.map((item) => {
                        return (<option value={item.time}>{item.label}</option>);
                    })}
                </select>
                {getTagHint(this.hint)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private setPreset(event) {
        const dateRange = [];
        const dt = new Date();
        dt.setDate(dt.getDate() + parseInt(event.target.value, 10));

        if (event.target.value.indexOf('-') > -1) {
            dateRange.push(dt);
            dateRange.push(new Date());
        } else {
            dateRange.push(new Date());
            dateRange.push(dt);
        }

        this.fp.setDate(dateRange, true);
    }

    private isValid(): boolean {
        return !(this.required && !(this.value && this.value.length));
    }

    private setValue(selectedDates, _dateStr, _instance): void {
        this.value =
            selectedDates && selectedDates.length === 2
                ? `${selectedDates[0].toISOString().split('T')[0]},${
                      selectedDates[1].toISOString().split('T')[0]
                  }`
                : '';
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        this.emitValueChange();
        this.emitStatusChange();
    }

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isValid()
                ? ''
                : this.requiredMessage;
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
