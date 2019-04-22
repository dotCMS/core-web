import { Component, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus } from '../../models/dot-field-status.model';

interface DotFieldEvent {
    name: string;
}

interface DotFieldStatusEvent extends DotFieldEvent {
    status: DotFieldStatus;
}

interface DotFieldValueEvent extends DotFieldEvent {
    value: string;
}

const getOriginalStatus = (): DotFieldStatus => {
    return {
        dotValid: true,
        dotTouched: false,
        dotPristine: true
    };
};

const updateStatus = (
    state: DotFieldStatus,
    change: { [key: string]: boolean }
): DotFieldStatus => {
    return {
        ...state,
        ...change
    };
};

const getClassNames = (status: DotFieldStatus, isValid: () => boolean) => {
    return {
        'dot-valid': isValid(),
        'dot-invalid': !isValid(),
        'dot-pristine': status.dotPristine,
        'dot-dirty': !status.dotPristine,
        'dot-touched': status.dotTouched,
        'dot-untouched': !status.dotTouched
    };
};

const getTagHint = (hint: string): string => {
    return hint ? <span class='dot-field__hint'>{this.hint}</span> : '';
};

const getTagError = (show: boolean, message: string): string => {
    return show ? <span class='dot-field__error-meessage'>{message}</span> : '';
};

const getTagLabel = (name: string, label: string): string => {
    return <label htmlFor={name}>{label}</label>;
};

const getErrorClass = (valid: boolean): string => {
    return valid ? '' : 'dot-field__input--error';
};

@Component({
    tag: 'dot-textfield-1',
    styleUrl: 'dot-textfield-1.scss'
})
export class DotTextfieldComponent {
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

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

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
            class: getClassNames(this.status, this.isValid)
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
                    type='text'
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
