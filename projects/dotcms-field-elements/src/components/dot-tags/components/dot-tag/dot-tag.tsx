import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import Fragment from 'stencil-fragment';

@Component({
    tag: 'dot-tag',
    styleUrl: 'dot-tags.scss'
})
export class DotTagComponent {
    @Element() el: HTMLElement;
    @Prop() label: string;
    @Prop() disabled: boolean;

    @Event() remove: EventEmitter<String>;

    render() {
        return (
            <Fragment>
                <span>
                    {this.label}
                </span>
                <button type='button'
                    disabled={this.disabled}
                    onClick={() => this.removeTag()}>
                    x
                </button>
            </Fragment>
        );
    }

    private removeTag(): void {
        this.el.remove();
        this.remove.emit(this.label);
    }
}
