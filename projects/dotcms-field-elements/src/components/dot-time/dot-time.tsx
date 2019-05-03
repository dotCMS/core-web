import { Component, Element, Listen, Method, Prop, State } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldStatusClasses, DotLabel } from '../../models';
import { getOriginalStatus, getTagHint, getTagLabel } from '../../utils';

@Component({
    tag: 'dot-time',
    styleUrl: 'dot-time.scss'
})
export class DotTimeComponent {
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

    @State() status: DotFieldStatus = getOriginalStatus();
    @State() classNames: DotFieldStatusClasses;
    @State() errorMessageElement: JSX.Element;

    /**
     * Reset properties of the filed, clear value and emit events.
     */
    @Method()
    reset(): void {
        const input = this.el.querySelector('dot-input-calendar');
        input.reset();
    }

    @Listen('updateClassEvt')
    setclassNames(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.classNames = event.detail;
    }

    @Listen('errorElementEvt')
    setErrorElement(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.errorMessageElement = event.detail;
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
                    type="time"
                    label={this.label}
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
}
