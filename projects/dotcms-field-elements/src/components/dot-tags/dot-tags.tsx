import { Component, Prop, State, Element, Event, EventEmitter, Method } from '@stencil/core';
import Fragment from 'stencil-fragment';
import { DotFieldStatus, DotFieldValueEvent, DotFieldStatusEvent, DotLabel } from '../../models';
import {
    getClassNames,
    getOriginalStatus,
    getTagHint,
    getTagError,
    getTagLabel,
    getErrorClass,
    updateStatus
} from '../../utils';

@Component({
    tag: 'dot-tags',
    styleUrl: 'dot-tags.scss'
})
export class DotTagsComponent {
    @Element() el: HTMLElement;
    @Prop({ mutable: true }) value: string;
    @Prop() name: string;
    @Prop() regexCheck: string;
    @Prop() validationMessage: string;
    @Prop() label: string;
    @Prop() hint: string;
    @Prop() placeholder: string;
    @Prop() required: boolean;
    @Prop() requiredMessage: string;
    @Prop() disabled = false;
    @Prop() threshold = 0;
    @Prop() debounce = 300;

    @State() status: DotFieldStatus = getOriginalStatus();

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;
    @Event() selected: EventEmitter<String>;
    @Event() removed: EventEmitter<String>;

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
        this.emitStatusChange();
    }

    componentDidLoad(): void {
        if (this.value) {
            this.setDefaultValue(this.value);
        }

        this.el.querySelector('dot-autocomplete').blur();
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
                <div class='tag_container'></div>

                <dot-autocomplete
                    class={getErrorClass(this.status.dotValid)}
                    disabled={this.disabled || null}
                    placeholder={this.placeholder}
                    threshold={this.threshold}
                    debounce={this.debounce}
                    data={this.getData.bind(this)}
                    onBlur={() => this.blurHandler()}
                    onSelection={(event) => this.createTag(event.detail)}
                >
                </dot-autocomplete>

                {getTagHint(this.hint)}
                {getTagError(this.showErrorMessage(), this.getErrorMessage())}
            </Fragment>
        );
    }

    private createTag(label: string): void {
        if (!this.getTags().includes(label)){
            this.addTagElement(label);
            this.emitValueChange();
            this.selected.emit(label);
        }
    }

    private addTagElement(label: string): void {
        const tag = document.createElement('dot-tag');
        tag.label = label;

        tag.addEventListener('remove', (event: CustomEvent) => {
            this.emitValueChange();
            this.removed.emit(event.detail);
        });

        this.el.querySelector('.tag_container').append(tag);
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

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isRegexValid()
            ? this.isValid()
                ? ''
                : this.requiredMessage
            : this.validationMessage;
    }

    private blurHandler(): void {
        console.log('blurHandler 2');
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setDefaultValue(value: string): void {
        value.split(',').forEach((tagLabel) => {
            this.addTagElement(tagLabel.trim());
        });
    }

    private emitStatusChange(): void {
        this.statusChange.emit({
            name: this.name,
            status: this.status
        });
    }

    private emitValueChange(): void {
        this.value = this.getTags().join(',');

        this.valueChange.emit({
            name: this.name,
            value: this.value
        });
    }

    private getTags(): string[] {
        return Array.from(this.el.querySelectorAll('dot-tag'))
            .map(tag => tag.label);
    }

    private async getData(): Promise<String[]> {
        const source = await fetch(
            'https://tarekraafat.github.io/autoComplete.js/demo/db/generic.json'
        );
        const data = await source.json();
        console.log('data', data);
        // Returns Fetched data
        return data.map(item => item.food);
    }
}
