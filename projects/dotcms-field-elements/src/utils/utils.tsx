import { DotOption } from '../models/dot-option.model';
import { DotFieldStatus } from '../models/dot-field-status.model';

export function generateId(): number {
    return Date.now().valueOf();
}

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

export function getOriginalStatus(): DotFieldStatus {
    return {
        dotValid: true,
        dotTouched: false,
        dotPristine: true
    };
}

export function updateStatus(
    state: DotFieldStatus,
    change: { [key: string]: boolean }
): DotFieldStatus {
    return {
        ...state,
        ...change
    };
}

export function getClassNames(status: DotFieldStatus, isValid: boolean) {
    return {
        'dot-valid': isValid,
        'dot-invalid': !isValid,
        'dot-pristine': status.dotPristine,
        'dot-dirty': !status.dotPristine,
        'dot-touched': status.dotTouched,
        'dot-untouched': !status.dotTouched
    };
}

export function getTagHint(hint: string) {
    return hint ? <span class="dot-field__hint">{hint}</span> : '';
}

export function getTagError(show: boolean, message: string) {
    return show ? <span class="dot-field__error-meessage">{message}</span> : '';
}

export function getTagLabel(name: string, label: string) {
    return <label htmlFor={name}>{label}</label>;
}

export function getErrorClass(valid: boolean): string {
    return valid ? '' : 'dot-field__input--error';
}

export function emitEvent(eventName: string, content: any, elem): void {
    elem.dispatchEvent(
        new CustomEvent(eventName, {
            bubbles: true,
            detail: content})
    );
}
