import { generateId, getItemsFromString } from '../../utils';
import Fragment from 'stencil-fragment';
export class DotCheckboxComponent {
    constructor() {
        this._values = {};
    }
    componentWillLoad() {
        this._options = getItemsFromString(this.options);
        this._label = `dotCheckbox_${generateId()}`;
    }
    setValue(event) {
        const checkBoxVal = event.target.value.toString();
        this._values = Object.assign({}, this._values, { [checkBoxVal]: !this._values[checkBoxVal] });
        this.onChange.emit({ value: this._values });
    }
    render() {
        return (h(Fragment, null,
            h("label", { htmlFor: this._label }, this.label),
            this._options.map((item) => {
                this._values = Object.assign({}, this._values, { [item.value]: this.value === item.value ? true : false });
                return (h("div", { class: 'dot-checkbox__container' },
                    h("input", { type: 'checkbox', name: item.value, checked: this.value === item.value ? true : null, onInput: (event) => this.setValue(event), value: item.value }),
                    h("label", { htmlFor: item.value }, item.label)));
            }),
            this.hint ? h("span", { class: 'dot-textfield__hint' }, this.hint) : ''));
    }
    static get is() { return "dot-checkbox"; }
    static get properties() { return {
        "_options": {
            "state": true
        },
        "_value": {
            "state": true
        },
        "hint": {
            "type": String,
            "attr": "hint"
        },
        "label": {
            "type": String,
            "attr": "label"
        },
        "options": {
            "type": String,
            "attr": "options"
        },
        "value": {
            "type": String,
            "attr": "value"
        }
    }; }
    static get events() { return [{
            "name": "onChange",
            "method": "onChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:dot-checkbox:**/"; }
}
