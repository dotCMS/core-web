# dot-key-value



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type      | Default     |
| ------------------ | ------------------- | ----------- | --------- | ----------- |
| `disabled`         | `disabled`          |             | `boolean` | `false`     |
| `fieldType`        | `field-type`        |             | `string`  | `''`        |
| `hint`             | `hint`              |             | `string`  | `''`        |
| `keyPlaceholder`   | `key-placeholder`   |             | `string`  | `''`        |
| `label`            | `label`             |             | `string`  | `''`        |
| `name`             | `name`              |             | `string`  | `''`        |
| `required`         | `required`          |             | `boolean` | `false`     |
| `requiredMessage`  | `required-message`  |             | `string`  | `''`        |
| `saveBtnLabel`     | `save-btn-label`    |             | `string`  | `'Add'`     |
| `value`            | `value`             |             | `string`  | `''`        |
| `valuePlaceholder` | `value-placeholder` |             | `string`  | `undefined` |


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
