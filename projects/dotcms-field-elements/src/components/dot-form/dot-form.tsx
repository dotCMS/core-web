import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';

@Component({
    tag: 'dot-form'
})
export class DotFormComponent {
    @Element() el: HTMLElement;
    @Event() formSubmit: EventEmitter;
    @Prop() submitLabel: string;
    @Prop() resetLabel: string;

    @Prop({ mutable: true }) _formValues = {};

    @Listen('valueChanges')
    onValueChanges(event: CustomEvent): void {
        this._formValues[event.detail.name] = event.detail.value;
    }

    @Listen('stateChanges')
    onStateChanges(event: CustomEvent): void {
        // refresh variables from hostData
        console.log('----onStateChanges', event);
    }

    hostData() {
        // TODO: do validation here
        return {
          'class': { 'is-open': this._formValues },
          'aria-hidden': this._formValues ? 'false' : 'true'
        };
      }

    handleSubmit(evt: Event): void {
        evt.preventDefault();
        this.formSubmit.emit(this._formValues);
    }

    resetForm(): void {
        this._formValues = {};
        const elementsCount = this.el.children[0].children.length;
        for (let i = 0, total = elementsCount; i < total - 2; i++) {
            try {
                const element: any = this.el.children[0].children[i];
                element.reset();
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }

    render() {
        return (
            <form onSubmit={(evt: Event) => this.handleSubmit(evt)}>
                <slot />
                <input type='submit' value={this.submitLabel} />
                <input type='button' value={this.resetLabel} onClick={() => this.resetForm()} />
            </form>
        );
    }
}
