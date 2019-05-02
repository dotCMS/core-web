export interface DotCMSContentTypeField {
    dataType?: string;
    defaultValue?: string;
    disabled?: boolean;
    fieldType?: string;
    hint?: string;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    regexCheck?: string;
    validationMessage?: string;
    required?: boolean;
    requiredMessage?: string;
    size?: string;
    values?: string;
    variable?: string;
}

export interface DotCMSDateField extends DotCMSContentTypeField {
    min?: string;
    max?: string;
    step?: string;
}
