import {
    DotOption,
    DotFieldStatus,
    DotFieldStatusClasses,
    DotLabel,
    DotKeyValueField
} from '../models';

/**
 * Based on a string formatted with comma separated values, returns a label/value DotOption array
 *
 * @param string rawString
 * @returns DotOption[]
 */
export function getDotOptionsFromFieldValue(rawString: string): DotOption[] {
    const items = rawString
        .split(',')
        .filter((item) => item.length > 0)
        .map((item) => {
            const [label, value] = item.split('|');
            return { label, value };
        });
    return items;
}

/**
 * Returns initial field Status, with possibilty to change Valid status when needed (reset value)
 *
 * @param boolean isValid
 * @returns DotFieldStatus
 */
export function getOriginalStatus(isValid?: boolean): DotFieldStatus {
    return {
        dotValid: typeof isValid === 'undefined' ? true : isValid,
        dotTouched: false,
        dotPristine: true
    };
}

/**
 * Returns a copy of field Status with new changes
 *
 * @param DotFieldStatus state
 * @param { [key: string]: boolean } change
 * @returns DotFieldStatus
 */
export function updateStatus(
    state: DotFieldStatus,
    change: { [key: string]: boolean }
): DotFieldStatus {
    return {
        ...state,
        ...change
    };
}

/**
 * Returns CSS classes object based on field Status values
 *
 * @param DotFieldStatus status
 * @param boolean isValid
 * @returns DotFieldClass
 */
export function getClassNames(
    status: DotFieldStatus,
    isValid: boolean,
    required?: boolean
): DotFieldStatusClasses {
    return {
        'dot-valid': isValid,
        'dot-invalid': !isValid,
        'dot-pristine': status.dotPristine,
        'dot-dirty': !status.dotPristine,
        'dot-touched': status.dotTouched,
        'dot-untouched': !status.dotTouched,
        'dot-required': required
    };
}

/**
 * Returns Hint tag if "hint" value defined
 *
 * @param string hint
 * @returns JSX.Element
 */
export function getTagHint(hint: string, name: string): JSX.Element {
    return hint ? (
        <span class="dot-field__hint" id={getHintId(name)}>
            {hint}
        </span>
    ) : (
        ''
    );
}

/**
 * Prefix the hint for the id param
 *
 * @param {string} name
 * @returns {string}
 */
export function getHintId(name: string): string {
    return `hint-${name}`;
}

/**
 * Returns Error tag if "show" value equals true
 *
 * @param boolean show
 * @param string message
 * @returns JSX.Element
 */
export function getTagError(show: boolean, message: string): JSX.Element {
    return show ? <span class="dot-field__error-message">{message}</span> : '';
}

/**
 * Returns Label tag
 *
 * @param string name
 * @param string label
 * @returns JSX.Element
 */
export function getTagLabel(params: DotLabel): JSX.Element {
    const Label = () => (
        <label htmlFor={getId(params.name)} id={`label-${params.name}`}>
            {params.label}
        </label>
    );

    return params.required ? (
        <div class="dot-field__label">
            <Label />
            {params.required ? <span class="dot-field__required-mark">*</span> : ''}
        </div>
    ) : (
        <Label />
    );
}

/**
 * Returns CSS class error to be set on main custom field
 *
 * @param boolean valid
 * @returns string
 */
export function getErrorClass(valid: boolean): string {
    return valid ? null : 'dot-field__error';
}

/**
 * Returns a single string formatted as "Key|Value" separated with commas from a DotKeyValueField array
 *
 * @param DotKeyValueField[] values
 * @returns string
 */
export function getStringFromDotKeyArray(values: DotKeyValueField[]): string {
    return values
        .map((item: DotKeyValueField) => {
            return `${item.key}|${item.value}`;
        })
        .join(',');
}

export function getId(name: string): string {
    return `dot-${name}`;
}
