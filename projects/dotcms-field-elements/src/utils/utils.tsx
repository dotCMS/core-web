import { DotOption, DotFieldEvent, DotFieldStatus, DotFieldClass } from '../models';

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

export function updateStatus(state: DotFieldStatus, change: { [key: string]: boolean }): DotFieldStatus {
    return {
        ...state,
        ...change
    };
}

export function getClassNames(status: DotFieldStatus, isValid: boolean): DotFieldClass {
    return {
        'dot-valid': isValid,
        'dot-invalid': !isValid,
        'dot-pristine': status.dotPristine,
        'dot-dirty': !status.dotPristine,
        'dot-touched': status.dotTouched,
        'dot-untouched': !status.dotTouched
    };
}

export function getTagHint(hint: string): JSX.Element {
    return hint ? <span class='dot-field__hint'>{hint}</span> : '';
}

export function getTagError(show: boolean, message: string): JSX.Element {
    return show ? <span class='dot-field__error-meessage'>{message}</span> : '';
}

export function getTagLabel(name: string, label: string): JSX.Element {
    return <label htmlFor={name}>{label}</label>;
}

export function getErrorClass(valid: boolean): string {
    return valid ? '' : 'dot-field__input--error';
}

export function emitEvent<T extends DotFieldEvent>(eventName: string, content: T, elem: Element): void {
    elem.dispatchEvent(
        new CustomEvent(eventName, {
            bubbles: true,
            detail: content})
    );
}
