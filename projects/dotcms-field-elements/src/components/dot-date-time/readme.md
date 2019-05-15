# dot-date-time



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                                                                                       | Type      | Default |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `disabled`          | `disabled`           | (optional) Disables field's interaction                                                                                                           | `boolean` | `false` |
| `hint`              | `hint`               | (optional) Hint text that suggest a clue of the field                                                                                             | `string`  | `''`    |
| `label`             | `label`              | (optional) Text to be rendered next to input field                                                                                                | `string`  | `''`    |
| `max`               | `max`                | (optional) Max value that the field will allow to set. Format should be year-month-day hour:minute:second \| year-month-day \| hour:minute:second | `string`  | `''`    |
| `min`               | `min`                | (optional) Min value that the field will allow to set. Format should be year-month-day hour:minute:second \| year-month-day \| hour:minute:second | `string`  | `''`    |
| `name`              | `name`               | Name that will be used as ID                                                                                                                      | `string`  | `''`    |
| `required`          | `required`           | (optional) Determine if it is needed                                                                                                              | `boolean` | `false` |
| `requiredMessage`   | `required-message`   | (optional) Text that be shown when required is set and condition not met                                                                          | `string`  | `''`    |
| `step`              | `step`               | (optional) Step that are indicated for the date and time input's separates by a comma (2,10)                                                      | `string`  | `''`    |
| `validationMessage` | `validation-message` | (optional) Text that be shown when min or max are set and condition not met                                                                       | `string`  | `''`    |
| `value`             | `value`              | Value should be year-month-day hour:minute:second e.g., 2005-12-01 15:22:00                                                                       | `string`  | `''`    |


## Events

| Event          | Description | Type                               |
| -------------- | ----------- | ---------------------------------- |
| `statusChange` |             | `CustomEvent<DotFieldStatusEvent>` |
| `valueChange`  |             | `CustomEvent<DotFieldValueEvent>`  |


## Methods

### `reset() => void`

Reset properties of the filed, clear value and emit events.

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
