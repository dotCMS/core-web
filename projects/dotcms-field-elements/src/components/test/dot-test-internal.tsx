import { Component, Prop } from '@stencil/core';

/**
 * Represent a dotcms label control.
 *
 * @export
 * @class DotLabelComponent
 */
@Component({
    tag: 'dot-test-internal'
})
export class DotLabelComponent {
    @Prop()
    data: string[];


    render() {
        console.log('internal render');
        return this.data.map(item => <h3>{item}</h3>);
    }
}

