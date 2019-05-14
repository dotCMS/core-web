import { Component, Prop, Event, EventEmitter, Element } from '@stencil/core';
import Fragment from 'stencil-fragment';
import autoComplete from '@tarekraafat/autocomplete.js/dist/js/autoComplete';

@Component({
    tag: 'dot-autocomplete',
    styleUrl: 'dot-autocomplete.scss'
})
export class DotAutocompleteComponent {

    @Element() el: HTMLElement;

    @Prop() disabled = false;
    @Prop() placeholder: string;
    @Prop({ mutable: true }) value: string;
    @Prop() threshold = 0;
    @Prop() maxResults = 0;
    @Prop() debounce = 300;
    @Prop() data: () => Promise<string[]>;

    @Event() selection: EventEmitter<string>;
    @Event() lostFocus: EventEmitter<FocusEvent>;

    private readonly id = `autoComplete${new Date().getTime()}`;;

    private keyEvent = {
        'Enter': this.emitSelection.bind(this),
        'Escape': this.clean.bind(this)
    };

    componentDidLoad(): void {
        // tslint:disable-next-line: no-unused-expression
        new autoComplete({
            data: {
                src: async () => {
                    console.log('data')
                    const autocomplete = document.querySelector(`#${this.id}`);
                    autocomplete.setAttribute('placeholder', 'Loading...');
                    const data = await this.data();
                    autocomplete.setAttribute('placeholder', this.placeholder || '');
                    return data;
                }
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
            placeHolder: this.placeholder,
            selector: `#${this.id}`,
            threshold: this.threshold,
            searchEngine: 'strict',
            highlight: true,
            maxResults: this.maxResults,
            debounce: this.debounce,
            resultsList: {
                container: () => {
                    return `${this.id}_results_list`;
                },
                destination: this.el.querySelector(`#${this.id}`),
                position: 'afterend'
            },
            resultItem: (data) => {
                return `${data.match}`;
            },
            onSelection: (feedback) => this.emitSelection(feedback.selection.value)
        });
    }

    render() {
        return (
            <Fragment>
                <input
                    disabled={this.disabled || null}
                    id ={this.id}
                    placeholder={this.placeholder}
                    value={this.value}
                    onBlur={this.handleBlur.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                />
            </Fragment>
        );
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const value = document.getElementById(this.id)['value'];

        if (value && this.keyEvent[event.key]) {
            this.keyEvent[event.key](value);
        }
    }

    private handleBlur(event: FocusEvent): void {
        this.lostFocus.emit(event);
        this.clean();
    }

    private clean(): void {
        document.getElementById(this.id)['value'] = '';
        Array.from(document.getElementById( `${this.id}_results_list`).querySelectorAll('li'))
            .forEach(child => {
                child.remove();
            }
        );
    }

    private emitSelection(selection: string): void {
        this.clean();
        this.selection.emit(selection);
    }
}
