import { Component, Prop } from '@stencil/core';
import { getLabelId } from '../../utils';

/**
 * Represent a dotcms label control.
 *
 * @export
 * @class DotLabelComponent
 */
@Component({
    tag: 'dot-label',
    styleUrl: 'dot-label.scss'
})
export class DotLabelComponent {
    /** (optional) Field name */
    @Prop() name = '';

    /** (optional) Text to be rendered */
    @Prop() label = '';

    /** (optional) Determine if it is mandatory */
    @Prop() required = false;

    render() {
        return this.required ? (
            <label class="dot-label" id={getLabelId(this.name)}>
                <span class="dot-label__text">
                    {this.label}
                    <span class="dot-label__required-mark">*</span>
                </span>
                <slot />
            </label>
        ) : (
            <label class="dot-label" id={getLabelId(this.name)}>
                <span class="dot-label__text">{this.label}</span>
                <slot />
            </label>
        );
    }
}
