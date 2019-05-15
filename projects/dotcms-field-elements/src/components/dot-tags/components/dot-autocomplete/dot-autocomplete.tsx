import { Component, Prop, Event, EventEmitter, Element, Watch } from '@stencil/core';
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
    @Prop() threshold = 0;
    @Prop() maxResults = 0;
    @Prop() debounce = 300;
    @Prop() data: () => Promise<string[]>;

    @Event() selection: EventEmitter<string>;
    @Event() lostFocus: EventEmitter<FocusEvent>;

    private readonly id = `autoComplete${new Date().getTime()}`;
    private autocomplete;

    private keyEvent = {
        'Enter': this.emitSelection.bind(this),
        'Escape': this.clean.bind(this)
    };

    componentDidLoad(): void {
        if (this.data) {
            this.initAutocomplete();
        }
    }

    render() {
        return (
            <Fragment>
                <input
                    disabled={this.disabled || null}
                    id ={this.id}
                    placeholder={this.placeholder}
                    onBlur={(event: FocusEvent) => this.handleBlur(event)}
                    onKeyDown={(event: KeyboardEvent) => this.handleKeyDown(event)}
                />
            </Fragment>
        );
    }

    @Watch('data')
    watchData(): void {
        if (!this.autocomplete) {
            this.initAutocomplete();
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const value = this.getInputElement()['value'];

        if (value && this.keyEvent[event.key]) {
            this.keyEvent[event.key](value);
        }
    }

    private handleBlur(event: FocusEvent): void {
        setTimeout(() => {
            if (document.activeElement.parentElement !== this.getResultList()) {
                this.clean();
                this.lostFocus.emit(event);
            }
        }, 0);
    }

    private clean(): void {
        this.getInputElement()['value'] = '';
        this.cleanOptions();
    }

    private cleanOptions(): void {
        const resultList = this.getResultList();

        if (resultList) {
            Array.from(resultList.querySelectorAll('li'))
                .forEach(child => child.remove()
            );
        }
    }

    private emitSelection(selection: string): void {
        this.clean();
        this.selection.emit(selection);
    }

    private getInputElement(): HTMLElement {
        return this.el.querySelector(`#${this.id}`);
    }

    private initAutocomplete(): void {
        // tslint:disable-next-line: no-unused-expression
        this.autocomplete = new autoComplete({
            data: {
                src: async () => this.getData()
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
                    return this.getResultListId();
                },
                destination: this.getInputElement(),
                position: 'afterend'
            },
            resultItem: (data) => {
                return `${data.match}`;
            },
            onSelection: (feedback) => this.emitSelection(feedback.selection.value)
        });
    }

    private getResultList(): HTMLElement {
        return this.el.querySelector(`#${this.getResultListId()}`);
    }

    private getResultListId(): string {
        return `${this.id}_results_list`;
    }

    private async getData(): Promise<string[]> {
        const autocomplete = this.getInputElement();
        autocomplete.setAttribute('placeholder', 'Loading...');
        const data = !!this.data ? await this.data() : [];
        autocomplete.setAttribute('placeholder', this.placeholder || '');
        return data;
    }
}
