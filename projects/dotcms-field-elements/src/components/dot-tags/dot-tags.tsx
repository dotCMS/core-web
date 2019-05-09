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

import autoComplete from '@tarekraafat/autocomplete.js/dist/js/autoComplete';

@Component({
    tag: 'dot-tags',
    styleUrl: 'dot-tags.scss'
})
export class DotTextfieldComponent {
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

    @State() status: DotFieldStatus = getOriginalStatus();

    @Event() valueChange: EventEmitter<DotFieldValueEvent>;
    @Event() statusChange: EventEmitter<DotFieldStatusEvent>;

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
        console.log('DONE');
        let resultsListID;
        const autoCompletejs = new autoComplete({
            data: {
                src: async () => {
                    // Loading placeholder text
                    document
                        .querySelector('#autoComplete')
                        .setAttribute('placeholder', 'Loading...');
                    // Fetch External Data Source
                    const source = await fetch(
                        'https://tarekraafat.github.io/autoComplete.js/demo/db/generic.json'
                    );
                    const data = await source.json();
                    // Returns Fetched data
                    return data;
                },
                key: ['food', 'cities', 'animals']
            },
            sort: (a, b) => {
                if (a.match < b.match) {
                    return -1;
                }
                if (a.match > b.match) {
                    return 1;
                }
                return 0;
            },
            placeHolder: 'Food & Drinks',
            selector: '#autoComplete',
            threshold: 0,
            searchEngine: 'strict',
            highlight: true,
            maxResults: 10,
            resultsList: {
                container: (source) => {
                    resultsListID = 'autoComplete_results_list';
                    return resultsListID;
                },
                destination: this.el.querySelector('#autoComplete'),
                position: 'afterend'
            },
            resultItem: (data, source) => {
                return `${data.match}`;
            },
            onSelection: (feedback) => {
                const selection = feedback.selection.value.food;
                // Render selected choice to selection div
                this.el.querySelector('.selection').innerHTML = selection;
                // Clear Input
                this.el.querySelector('#autoComplete').value = '';
                // Change placeholder with the selected value
                this.el.querySelector('#autoComplete').setAttribute('placeholder', selection);
                // Concole log autoComplete data feedback
                console.log(feedback);
            }
        });
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
                <input
                    class={getErrorClass(this.status.dotValid)}
                    disabled={this.disabled || null}
                    id={this.name}
                    onBlur={() => this.blurHandler()}
                    id='autoComplete'
                    // onInput={this.inputHandler}
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

    // private inputHandler(e) {
    //     console.log(e.target.value);
    // }

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
        if (!this.status.dotTouched) {
            this.status = updateStatus(this.status, {
                dotTouched: true
            });
            this.emitStatusChange();
        }
    }

    // private setValue(event): void {
    //     this.value = event.target.value.toString();
    //     this.status = updateStatus(this.status, {
    //         dotTouched: true,
    //         dotPristine: false,
    //         dotValid: this.isValid()
    //     });
    //     this.emitValueChange();
    //     this.emitStatusChange();
    // }

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
