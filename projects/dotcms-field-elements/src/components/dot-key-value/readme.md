# dot-key-value



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                     | Type      | Default     |
| ------------------ | ------------------- | --------------------------------------------------------------- | --------- | ----------- |
| `disabled`         | `disabled`          |                                                                 | `boolean` | `false`     |
| `fieldKeyLabel`    | `field-key-label`   | (optional) The string to use in the key label of the add form   | `string`  | `'Key'`     |
| `fieldType`        | `field-type`        |                                                                 | `string`  | `undefined` |
| `fieldValueLabel`  | `field-value-label` | (optional) The string to use in the value label of the add form | `string`  | `'Value'`   |
| `hint`             | `hint`              |                                                                 | `string`  | `undefined` |
| `keyPlaceholder`   | `key-placeholder`   |                                                                 | `string`  | `undefined` |
| `label`            | `label`             |                                                                 | `string`  | `undefined` |
| `name`             | `name`              |                                                                 | `string`  | `undefined` |
| `required`         | `required`          |                                                                 | `boolean` | `undefined` |
| `requiredMessage`  | `required-message`  |                                                                 | `string`  | `undefined` |
| `saveBtnLabel`     | `save-btn-label`    |                                                                 | `string`  | `'Add'`     |
| `value`            | `value`             |                                                                 | `string`  | `undefined` |
| `valuePlaceholder` | `value-placeholder` |                                                                 | `string`  | `undefined` |


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
