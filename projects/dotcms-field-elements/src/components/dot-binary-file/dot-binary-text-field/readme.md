# dot-binary-text-field



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                        | Type       | Default                         |
| ------------- | ------------- | -------------------------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| `accept`      | --            | (optional) Array that describes a type of file that may be selected by the user, eg: .pdf,.jpg     | `string[]` | `undefined`                     |
| `disabled`    | `disabled`    | (optional) Disables field's interaction                                                            | `boolean`  | `false`                         |
| `hint`        | `hint`        | (optional) Hint text that suggest a clue of the field                                              | `string`   | `''`                            |
| `placeholder` | `placeholder` | (optional) Placeholder specifies a short hint that describes the expected value of the input field | `string`   | `'Drop or paste a file or url'` |
| `required`    | `required`    | (optional) Determine if it is mandatory                                                            | `boolean`  | `false`                         |
| `value`       | `value`       | Value specifies the value of the <input> element                                                   | `any`      | `null`                          |


## Events

| Event        | Description | Type                              |
| ------------ | ----------- | --------------------------------- |
| `fileChange` |             | `CustomEvent<DotBinaryFileEvent>` |
| `onBlur`     |             | `CustomEvent<void>`               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
