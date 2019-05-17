import { Component, Prop, State, Element, Method, Event, EventEmitter, Watch } from '@stencil/core';
import Fragment from 'stencil-fragment';
import {
    DotOption,
    DotFieldStatus,
    DotFieldValueEvent,
    DotFieldStatusEvent,
    DotLabel
} from '../../models';
import {
    getClassNames,
    getDotOptionsFromFieldValue,
    getErrorClass,
    getId,
    getOriginalStatus,
    getTagError,
    getTagHint,
    getTagLabel,
    updateStatus,
    dotPropValidator
} from '../../utils';

/**
 * Represent a dotcms multi select control.
 *
 * @export
 * @class DotSelectComponent
 */
@Component({
    tag: 'dot-multi-select',
    styleUrl: 'dot-multi-select.scss'
})
export class DotMultiSelectComponent {
    @Element() el: HTMLElement;

    @Prop() disabled = false;
    @Prop() name: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() options: string;
    @Prop() required: boolean;
    @Prop() requiredMessage: string;
    @Prop() size: number;
    @Prop({ mutable: true }) value: string;

    @State() _options: DotOption[];
    @State() status: DotFieldStatus = getOriginalStatus();

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

    _dotTouched = false;
    _dotPristine = true;

    componentWillLoad() {
        this.validateProps();
        this.emitInitialValue();
        this.emitStatusChange();
    }

    @Watch('options')
    optionsWatch(): void {
        const validOptions = dotPropValidator<DotMultiSelectComponent, DotOption[]>(
            this,
            'options'
        );
        this._options = getDotOptionsFromFieldValue(validOptions);
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid(), this.required)
        };
    }

    /**
     * Reset properties of the field, clear value and emit events.
     *
     * @memberof DotSelectComponent
     *
     */
    @Method()
    reset(): void {
        this.value = '';
        this.status = getOriginalStatus(this.isValid());
        this.emitInitialValue();
        this.emitStatusChange();
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
                <select
                    multiple
                    size={+this.size || 0}
                    class={getErrorClass(this.status.dotValid)}
                    id={getId(this.name)}
                    disabled={this.shouldBeDisabled()}
                    onChange={() => this.setValue()}
                >
                    {this._options.map((item: DotOption) => {
                        return (
                            <option
                                selected={this.value === item.value ? true : null}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        );
                    })}
                </select>
                {getTagHint(this.hint)}
                {getTagError(!this.isValid(), this.requiredMessage)}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.optionsWatch();
    }

    private shouldBeDisabled(): boolean {
        return this.disabled ? true : null;
    }

    // Todo: find how to set proper TYPE in TS
    private setValue(): void {
        this.value = this.getValueFromMultiSelect();
        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });
        this.emitValueChange();
        this.emitStatusChange();
    }

    private getValueFromMultiSelect(): string {
        const selected = this.el.querySelectorAll('option:checked');
        const values = Array.from(selected).map((el: any) => el.value);
        return Array.from(values).join(',');
    }

    private emitInitialValue() {
        if (!this.value) {
            this.value = this._options[0].value;
            this.emitValueChange();
        }
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.status
        });
    }

    private isValid(): boolean {
        return this.required ? !!this.value : true;
    }

    private emitValueChange(): void {
        this.valueChange.emit({
            name: this.name,
            value: this.value
        });
    }
}
