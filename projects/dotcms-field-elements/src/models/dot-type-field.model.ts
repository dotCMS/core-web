export interface DotCMSContentTypeField {
    dataType?: string;
    defaultValue?: string | any;
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
    min?: string;
    max?: string;
    step?: string;
}

export interface DotCMSKeyValueField extends DotCMSContentTypeField {
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    saveBtnLabel?: string;
}
