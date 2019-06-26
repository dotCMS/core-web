# dot-binary-text-field



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                        | Type      | Default                                                             |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| `accept`      | `accept`      | (optional) Array that describes a type of file that may be selected by the user, eg: .pdf,.jpg     | `string`  | `''`                                                                |
| `disabled`    | `disabled`    | (optional) Disables field's interaction                                                            | `boolean` | `false`                                                             |
| `name`        | `name`        | Name that will be used as ID                                                                       | `string`  | `''`                                                                |
| `placeholder` | `placeholder` | (optional) Placeholder specifies a short hint that describes the expected value of the input field | `string`  | `'Attach files by dragging & dropping, selecting or pasting them.'` |
| `required`    | `required`    | (optional) Determine if it is mandatory                                                            | `boolean` | `false`                                                             |
| `value`       | `value`       | Value specifies the value of the <input> element                                                   | `any`     | `null`                                                              |


## Events

| Event           | Description | Type                                    |
| --------------- | ----------- | --------------------------------------- |
| `_statusChange` |             | `CustomEvent<DotBinaryTextStatusEvent>` |
| `_valueChange`  |             | `CustomEvent<DotFieldValueEvent>`       |


## Methods

### `reset() => void`

Reset properties of the field, clear value and emit events.

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
