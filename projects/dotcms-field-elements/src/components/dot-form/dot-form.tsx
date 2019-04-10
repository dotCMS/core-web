import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';

@Component({
    tag: 'dot-form'
})
export class DotFormComponent {
    @Element() el: HTMLElement;
    @Event() formSubmit: EventEmitter;
    @Prop() submitLabel = 'Submit';
    @Prop() resetLabel = 'Reset';

    @Prop({ mutable: true }) _formValues = {};

    @Listen('valueChanges')
    onValueChanges(event: CustomEvent): void {
        this._formValues[event.detail.target.name] = event.detail.target.value;
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
        this.formSubmit.emit({
            target: this.el,
            status: { dirty: true }}
        );
    }

    resetForm(): void {
        this._formValues = {};
        const elements = Array.from(this.el.querySelector('form').children);
        elements.forEach((element: any) => {
            try {
                element.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        });
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
