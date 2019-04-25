import { DotOption, DotFieldStatus, DotFieldStatusClasses, DotFieldStatusEvent, DotFieldValueEvent } from '../models';

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
            const splittedItem = item.split('|');
            return { label: splittedItem[0], value: splittedItem[1] };
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
        dotValid: typeof isValid !== 'undefined' ? isValid : true,
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
export function updateStatus(state: DotFieldStatus, change: { [key: string]: boolean }): DotFieldStatus {
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
export function getClassNames(status: DotFieldStatus, isValid: boolean): DotFieldStatusClasses {
    return {
        'dot-valid': isValid,
        'dot-invalid': !isValid,
        'dot-pristine': status.dotPristine,
        'dot-dirty': !status.dotPristine,
        'dot-touched': status.dotTouched,
        'dot-untouched': !status.dotTouched
    };
}

/**
 * Returns Hint tag if "hint" value defined
 *
 * @param string hint
 * @returns JSX.Element
 */
export function getTagHint(hint: string) {
    return hint ? <span class='dot-field__hint'>{hint}</span> : '';
}

/**
 * Returns Error tag if "show" value equals truth
 *
 * @param boolean show
 * @param string message
 * @returns JSX.Element
 */
export function getTagError(show: boolean, message: string): JSX.Element {
    return show ? <span class='dot-field__error-meessage'>{message}</span> : '';
}

/**
 * Returns Label tag
 *
 * @param string name
 * @param string label
 * @returns JSX.Element
 */
export function getTagLabel(name: string, label: string): JSX.Element {
    return <label htmlFor={name}>{label}</label>;
}

/**
 * Returns CSS class error to be set on main custom field
 *
 * @param boolean valid
 * @returns string
 */
export function getErrorClass(valid: boolean): string {
    return valid ? '' : 'dot-field__error';
}

/**
 * Emits a Custom Event for status & value changes
 *
 * @param string eventName
 * @param (DotFieldValueEvent|DotFieldStatusEvent) content
 * @param Element elem
 */
export function emitEvent<T extends DotFieldValueEvent|DotFieldStatusEvent>(eventName: string, content: T, elem: Element): void {
    elem.dispatchEvent(
        new CustomEvent(eventName, {
            bubbles: true,
            detail: content})
    );
}
