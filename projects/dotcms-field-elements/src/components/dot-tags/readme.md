# dot-tags



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type      | Default |
| ----------------- | ------------------ | ----------- | --------- | ------- |
| `debounce`        | `debounce`         |             | `number`  | `300`   |
| `disabled`        | `disabled`         |             | `boolean` | `false` |
| `hint`            | `hint`             |             | `string`  | `''`    |
| `label`           | `label`            |             | `string`  | `''`    |
| `name`            | `name`             |             | `string`  | `''`    |
| `placeholder`     | `placeholder`      |             | `string`  | `''`    |
| `required`        | `required`         |             | `boolean` | `false` |
| `requiredMessage` | `required-message` |             | `string`  | `''`    |
| `threshold`       | `threshold`        |             | `number`  | `0`     |
| `value`           | `value`            |             | `string`  | `''`    |


## Events

| Event          | Description | Type                               |
| -------------- | ----------- | ---------------------------------- |
| `removed`      |             | `CustomEvent<String>`              |
| `selected`     |             | `CustomEvent<String>`              |
| `statusChange` |             | `CustomEvent<DotFieldStatusEvent>` |
| `valueChange`  |             | `CustomEvent<DotFieldValueEvent>`  |


## Methods

### `reset() => void`

Reset properties of the filed, clear value and emit events.

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
