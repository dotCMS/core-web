# dot-radio



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                      | Type      | Default     |
| ----------------- | ------------------ | -------------------------------------------------------------------------------- | --------- | ----------- |
| `disabled`        | `disabled`         | (optional) Disables field's interaction                                          | `boolean` | `false`     |
| `hint`            | `hint`             | (optional) Hint text that suggest a clue of the field                            | `string`  | `undefined` |
| `label`           | `label`            | (optional) Text to be rendered next to input field                               | `string`  | `undefined` |
| `name`            | `name`             | Name that will be used as ID                                                     | `string`  | `undefined` |
| `options`         | `options`          | Value/Label ratio options separated by comma, to be formatted as: Value\|Label   | `string`  | `undefined` |
| `required`        | `required`         | (optional) Determine if it is mandatory                                          | `boolean` | `undefined` |
| `requiredMessage` | `required-message` | (optional) Text that will be shown when required is set and condition is not met | `string`  | `undefined` |
| `value`           | `value`            | Value set from the ratio option                                                  | `string`  | `undefined` |


## Events

| Event          | Description | Type                               |
| -------------- | ----------- | ---------------------------------- |
| `statusChange` |             | `CustomEvent<DotFieldStatusEvent>` |
| `valueChange`  |             | `CustomEvent<DotFieldValueEvent>`  |


## Methods

### `reset() => void`

Reset properties of the field, clear value and emit events.

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
