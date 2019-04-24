import { Component, Prop, State, Element, Method } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus } from '../../models';
import {
    emitEvent,
    getClassNames,
    getOriginalStatus,
    getTagHint,
    getTagError,
    getTagLabel,
    getErrorClass,
    updateStatus
} from '../../utils';

@Component({
    tag: 'dot-textfield',
    styleUrl: 'dot-textfield-1.scss'
})
export class DotTextfieldComponent {
    @Element() el: HTMLElement;
    @Prop({ mutable: true }) value: string;
    @Prop() name: string;
    @Prop() regexcheck: string;
    @Prop() regexcheckmessage: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() placeholder: string;
    @Prop() required: boolean;
    @Prop() requiredmessage: string;
    @Prop() disabled = false;

    @State() status: DotFieldStatus = getOriginalStatus();

    /**
     * Reset properties of the filed, clear value and emit events.
     */
    @Method()
    reset(): void {
        this.status = getOriginalStatus();
        this.value = '';
        this.emitStatusChange();
        this.emitValueChange();
    }

    componentWillLoad(): void {
        this.emitStatusChange();
    }

    hostData() {
        return {
            class: getClassNames(this.status, this.isValid())
        };
    }

    render() {
        return (
            <Fragment>
                {getTagLabel(this.name, this.label)}
                <input
                    class={getErrorClass(this.status.dotValid)}
                    disabled={this.disabled || null}
                    id={this.name}
                    onBlur={() => this.blurHandler()}
                    onInput={(event: Event) => this.setValue(event)}
                    placeholder={this.placeholder}
                    required={this.required || null}
                    type="text"
                    value={this.value}
                />
                {getTagHint(this.hint)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private isValid(): boolean {
        return !this.isValueRequired() && this.isRegexValid();
    }

    private isValueRequired(): boolean {
        return this.required && !this.value.length;
    }

    private isRegexValid(): boolean {
        if (this.regexcheck && this.value.length) {
            const regex = new RegExp(this.regexcheck, 'ig');
            return regex.test(this.value);
        }
        return true;
    }

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isRegexValid()
            ? this.isValid()
                ? ''
                : this.requiredmessage
            : this.regexcheckmessage;
    }

    private blurHandler(): void {
        if (!this.status.dotTouched) {
            updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setValue(event): void {
        updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });

        this.value = event.target.value.toString();
        this.emitValueChange();
        this.emitStatusChange();
    }

    private emitStatusChange(): void {
        emitEvent('statusChange', {
            name: this.name,
            status: this.status
        }, this.el);
    }

    private emitValueChange(): void {
        emitEvent('valueChange', {
            name: this.name,
            value: this.value
        }, this.el);
    }
}
