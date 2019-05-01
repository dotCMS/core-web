import { DotCMSContentTypeField } from '../../models';

export const DotFormFields = {
    Text: (field: DotCMSContentTypeField) => (
        <dot-textfield
            disabled={field.disabled}
            label={field.name}
            name={field.variable}
            regexcheck={field.regexCheck}
            validationMessage={field.validationMessage}
            placeholder={field.placeholder}
            hint={field.hint}
            value={field.defaultValue}
            required={field.required}
            requiredmessage={field.requiredMessage}
        />
    ),

    Textarea: (field: DotCMSContentTypeField) => (
        <dot-textarea
            disabled={field.disabled}
            label={field.name}
            name={field.variable}
            regexcheck={field.regexCheck}
            validationMessage={field.validationMessage}
            hint={field.hint}
            value={field.defaultValue}
            required={field.required}
            requiredmessage={field.requiredMessage}
        />
    ),

    Checkbox: (field: DotCMSContentTypeField) => (
        <dot-checkbox
            disabled={field.disabled}
            hint={field.hint}
            label={field.name}
            name={field.variable}
            options={field.values}
            required={field.required}
            requiredmessage={field.requiredMessage}
            value={field.defaultValue}
        />
    ),

    Select: (field: DotCMSContentTypeField) => (
        <dot-select
            disabled={field.disabled}
            hint={field.hint}
            label={field.name}
            name={field.variable}
            options={field.values}
            required={field.required}
            requiredmessage={field.requiredMessage}
            value={field.defaultValue}
        />
    ),

    Radio: (field: DotCMSContentTypeField) => (
        <dot-radio
            disabled={field.disabled}
            hint={field.hint}
            label={field.name}
            name={field.variable}
            options={field.values}
            required={field.required}
            requiredmessage={field.requiredMessage}
            value={field.defaultValue}
        />
    ),

    Date: (field: DotCMSContentTypeField) => (
        <dot-date
            disabled={field.disabled}
            label={field.name}
            name={field.variable}
            hint={field.hint}
            value={field.defaultValue}
            required={field.required}
            requiredmessage={field.requiredMessage}
            validationMessage={field.validationMessage}
            min={field.min}
            max={field.max}
            step={field.step}
        />
    )
};
