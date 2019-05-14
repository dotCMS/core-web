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
                    onLostFocus={() => this.blurHandler()}
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
            this.setValue();
            this.selected.emit(label);
        }
    }

    private addTagElement(label: string): void {
        const tag = document.createElement('dot-tag');
        tag.label = label;

        tag.addEventListener('remove', (event: CustomEvent) => {
            this.setValue();
            this.removed.emit(event.detail);
        });

        this.el.querySelector('.tag_container').append(tag);
    }

    private isValid(): boolean {
        return !this.required || (this.required && !!this.value.length);
    }

    private showErrorMessage(): boolean {
        return this.getErrorMessage() && !this.status.dotPristine;
    }

    private getErrorMessage(): string {
        return this.isValid()
                ? ''
                : this.requiredMessage;
    }

    private blurHandler(): void {
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    private setDefaultValue(value: string): void {
        console.log('setDefaultValue  ' + this.value);
        Array.from(this.el.querySelectorAll('dot-tag'))
            .forEach(tag => tag.remove());

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

    private setValue(): void {
        this.value = this.getTags().join(',');

        this.status = updateStatus(this.status, {
            dotTouched: true,
            dotPristine: false,
            dotValid: this.isValid()
        });

        this.emitValueChange();
        this.emitStatusChange();
    }

    private emitValueChange(): void {
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
        return (await source.json()).map(item => item.food);
    }
}
