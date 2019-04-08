import { Component, Element, Event, EventEmitter, Listen, Prop } from '@stencil/core';

@Component({
    tag: 'dot-form'
})
export class DotFormComponent {
    @Element() el: HTMLElement;
    @Event() formSubmit: EventEmitter;
    @Prop() submitLabel: string;
    @Prop() resetLabel: string;

    _formValues = {};

    @Listen('valueChanges')
    onValueChanges(event: any): void {
        this._formValues[event.detail.name] = event.detail.value;
        console.log('--this._formValues', this._formValues);
    }

    @Listen('stateChanges')
    onStateChanges(event: CustomEvent): void {
        // refresh variables from hostData
        console.log('----onStateChanges', event);
    }

    hostData() {
        console.log('---hostdata');
        return {
          'class': { 'is-open': this._formValues },
          'aria-hidden': this._formValues ? 'false' : 'true'
        };
      }

    handleSubmit(e): void {
        e.preventDefault();

// TODO:
// - Implement RESET
// - Unit Test

// TODO Next Task:
// - Implement Form STATUS -> funcion y mapa de estados de elementos
// - Implement Validation


        // this.hostData();

        // Set value on child
        // this.el.children[0].children[0].attributes['value'].value = 'kk';


        // console.log('--handleSubmit', e, 'STATE:', this._formValues);
        // console.log('--Element', this.el.children[0].children[0].attributes['value'].value);

        // Reset call to element
        // const kk: any = this.el.children[0].children[0];
        // kk.reset();
        console.log('--this._formValues', this._formValues);
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
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <slot />
                <input type='submit' value={this.submitLabel} />
                <input type='button' value={this.resetLabel} onClick={() => this.resetForm()} />
            </form>
        );
    }
}
