# dot-input-calendar



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                           | Type      | Default     |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------- | --------- | ----------- |
| `disabled`          | `disabled`           | (optional) Disables field's interaction                                               | `boolean` | `false`     |
| `max`               | `max`                | (optional) Max, maximum value that the field will allow to set, expect a Date Format  | `""`      | `undefined` |
| `min`               | `min`                | (optional) Min, minimum value that the field will allow to set, expect a Date Format. | `""`      | `undefined` |
| `name`              | `name`               | Name that will be used as ID                                                          | `""`      | `undefined` |
| `required`          | `required`           | (optional) Determine if it is mandatory                                               | `boolean` | `undefined` |
| `requiredMessage`   | `required-message`   | (optional) Text that be shown when required is set and condition not met              | `""`      | `undefined` |
| `step`              | `step`               | (optional) Step specifies the legal number intervals for the input field              | `""`      | `undefined` |
| `type`              | `type`               | type specifies the type of <input> element to display                                 | `""`      | `undefined` |
| `validationMessage` | `validation-message` | (optional) Text that be shown when min or max are set and condition not met           | `""`      | `undefined` |
| `value`             | `value`              | Value specifies the value of the <input> element                                      | `""`      | `undefined` |


## Events

| Event           | Description | Type                               |
| --------------- | ----------- | ---------------------------------- |
| `_errorMessage` |             | `CustomEvent<void>`                |
| `_statusChange` |             | `CustomEvent<DotFieldStatusEvent>` |
| `_valueChange`  |             | `CustomEvent<DotFieldValueEvent>`  |


## Methods

### `reset() => void`

Reset properties of the field, clear value and emit events.

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
