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
    regexCheckMessage?: string;
    required?: boolean;
    requiredMessage?: string;
    size?: string;
    values?: string;
    variable?: string;
}

export interface DotCMSKeyValueField extends DotCMSContentTypeField {
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    saveBtnLabel?: string;
}
