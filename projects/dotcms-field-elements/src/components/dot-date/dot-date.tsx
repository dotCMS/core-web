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
    DotFieldStatusEvent,
    DotFieldValueEvent,
    DotLabel
} from '../../models';
import {
    dotPropValidator,
    getClassNames,
    getOriginalStatus,
    getTagError,
    getTagHint,
    getTagLabel
} from '../../utils';

@Component({
    tag: 'dot-date',
    styleUrl: 'dot-date.scss'
})
export class DotDateComponent {
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
    @Prop({ mutable: true })
    min: string;
    @Prop({ mutable: true })
    max: string;
    @Prop({ mutable: true })
    step: string;

    @State() classNames: DotFieldStatusClasses;
    @State() errorMessageElement: JSX.Element;

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

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

    @Watch('value')
    valueWatch(): void {
        this.value = dotPropValidator(this, 'value', 'date');
    }

    @Watch('min')
    minWatch(): void {
        this.value = dotPropValidator(this, 'min', 'date');
    }

    @Watch('max')
    maxWatch(): void {
        this.value = dotPropValidator(this, 'max', 'date');
    }

    @Watch('step')
    stepWatch(): void {
        this.value = dotPropValidator(this, 'step', 'number');
    }

    @Listen('_valueChange')
    emitValueChange(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.valueChange.emit(event.detail);
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
        this.errorMessageElement = getTagError(event.detail.show, event.detail.message);
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
                    name={this.name}
                    hint={this.hint}
                    value={this.value}
                    required={this.required}
                    required-message={this.requiredMessage}
                    validation-message={this.validationMessage}
                    min={this.min}
                    max={this.max}
                    step={this.step}
                />
                {getTagHint(this.hint)}
                {this.errorMessageElement}
            </Fragment>
        );
    }

    private validateProps(): void {
        this.valueWatch();
        this.minWatch();
        this.maxWatch();
        this.stepWatch();
    }
}
