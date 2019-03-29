import { h } from '../mycomponent.core.js';

import { a as getItemsFromString, b as generateId, c as Fragment } from './chunk-a767eee6.js';

class DotDropdownComponent {
    componentWillLoad() {
        this._options = getItemsFromString(this.options);
        this._label = `dotDropdown_${generateId()}`;
    }
    setValue(event) {
        this._value = event.target[event.target.selectedIndex].label;
        this.onChange.emit({ value: this._value });
    }
    render() {
        return (h(Fragment, null,
            h("label", { htmlFor: this._label }, this.label),
            h("select", { name: this._label, onChange: (event) => this.setValue(event) }, this._options.map((item) => {
                return (h("option", { selected: this.value === item.value ? true : null, value: item.value }, item.label));
            })),
            this.hint ? h("span", { class: 'dot-textfield__hint' }, this.hint) : ''));
    }
    static get is() { return "dot-dropdown"; }
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
    static get style() { return ""; }
}

export { DotDropdownComponent as DotDropdown };
