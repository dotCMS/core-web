import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import Fragment from 'stencil-fragment';

@Component({
    tag: 'dot-chip',
    styleUrl: 'dot-chip.scss'
})
export class DotChipComponent {
    @Element() el: HTMLElement;

    /** Chip's label */
    @Prop() label = '';

    /** (optional) Delete button's label */
    @Prop() deleteLabel = 'delete';

    /** (optional) If is true disabled the delete button */
    @Prop() disabled = false;

    @Event() remove: EventEmitter<String>;

    render() {
        const label = `Delete ${this.label} tag`;
        return (
            <Fragment>
                <span>
                    {this.label}
                </span>
                <button type="button"
                    aria-label={label}
                    disabled={this.disabled}
                    onClick={() => this.removeTag()}>
                    {this.deleteLabel}
                </button>
            </Fragment>
        );
    }

    private removeTag(): void {
        this.remove.emit(this.label);
    }
}
