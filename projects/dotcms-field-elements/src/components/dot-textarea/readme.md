# dot-textfield



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type      | Default |
| ------------------- | -------------------- | ----------- | --------- | ------- |
| `disabled`          | `disabled`           |             | `boolean` | `false` |
| `hint`              | `hint`               |             | `string`  | `''`    |
| `label`             | `label`              |             | `string`  | `''`    |
| `name`              | `name`               |             | `string`  | `''`    |
| `regexCheck`        | `regex-check`        |             | `string`  | `''`    |
| `required`          | `required`           |             | `boolean` | `false` |
| `requiredMessage`   | `required-message`   |             | `string`  | `''`    |
| `validationMessage` | `validation-message` |             | `string`  | `''`    |
| `value`             | `value`              |             | `string`  | `''`    |


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
