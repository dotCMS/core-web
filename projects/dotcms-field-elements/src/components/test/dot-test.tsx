import { Component, State } from '@stencil/core';
import Fragment from 'stencil-fragment';

/**
 * Represent a dotcms label control.
 *
 * @export
 * @class DotLabelComponent
 */
@Component({
    tag: 'dot-test'
})
export class DotLabelComponent {
    @State() data = ['1', '2', '3'];

    private internal = ['hello', 'world'];

    onClick(): void {
        this.data = [...this.data, new Date().getTime().toString()];
    }

    render() {
        console.log('render');
        return (
            <Fragment>
                <button onClick={() => this.onClick()}>Click</button>
                <dot-test-internal data={this.internal} />
            </Fragment>
        );
    }
}
