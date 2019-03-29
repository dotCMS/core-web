import { generateId } from '../../utils';
import Fragment from 'stencil-fragment';
export class DotTextfieldComponent {
    constructor() {
        this._error = false;
    }
    validate(value) {
        if (this.required && value.length === 0) {
            return true;
        }
        if (this.regexcheck) {
            const regex = new RegExp(this.regexcheck, 'ig');
            return !regex.test(value);
        }
        return false;
    }
    setValue(event) {
        this._value = event.target.value.toString();
        this._error = this.validate(this._value);
        this.onChange.emit({ error: this._error, value: this._value });
    }
    componentWillLoad() {
        this._label = `dotTextfield_${generateId()}`;
        this._value = this._value && this._value.length > -1 ? this._value : this.value;
    }
    render() {
        return (h(Fragment, null,
            h("label", { htmlFor: this._label }, this.label),
            h("input", { class: this._error ? 'dot-textfield__input--error' : '', name: this._label, type: 'text', value: this._value, placeholder: this.placeholder, required: this.required ? true : null, onInput: (event) => this.setValue(event) }),
            this.hint ? h("span", { class: 'dot-textfield__hint' }, this.hint) : ''));
    }
    static get is() { return "dot-textfield"; }
    static get properties() { return {
        "_error": {
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
        "placeholder": {
            "type": String,
            "attr": "placeholder"
        },
        "readOnly": {
            "type": String,
            "attr": "read-only"
        },
        "regexcheck": {
            "type": String,
            "attr": "regexcheck"
        },
        "required": {
            "type": Boolean,
            "attr": "required"
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
    static get style() { return "/**style-placeholder:dot-textfield:**/"; }
}
