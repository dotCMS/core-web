import { DotCMSContentTypeField, DotCMSKeyValueField } from '../../models';

export const DotFormFields = {
    Text: (field: DotCMSContentTypeField) => (
        <dot-textfield
            disabled={field.disabled}
            label={field.name}
            name={field.variable}
            regexcheck={field.regexCheck}
            regexcheckmessage={field.regexCheckMessage}
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
            regexcheckmessage={field.regexCheckMessage}
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

    'Key-Value': (field: DotCMSKeyValueField) => (
        <dot-key-value
            disabled={field.disabled}
            label={field.name}
            fieldType={field.fieldType}
            saveBtnLabel={field.saveBtnLabel}
            name={field.variable}
            keyPlaceholder={field.keyPlaceholder}
            valuePlaceholder={field.valuePlaceholder}
            hint={field.hint}
            value={field.defaultValue}
            required={field.required}
            requiredmessage={field.requiredMessage}
        />
    ),

    'Multi-Select': (field: DotCMSContentTypeField) => (
        <dot-multi-select
            disabled={field.disabled}
            hint={field.hint}
            label={field.name}
            name={field.variable}
            options={field.values}
            required={field.required}
            requiredmessage={field.requiredMessage}
            size={+field.size}
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
    )
};
