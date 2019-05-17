import { dotParseDate, dotValidateDate, dotValidateTime, isValidDateSlot } from './dateUtils';

const PROP_VALIDATION_HANDLING = {
    options: stringValidator,
    regexCheck: regexValidator,
    string: stringValidator,
    number: numberValidator,
    time: timeValidator,
    date: dateValidator,
    dateTime: dateTimeValidator,
    step: stringValidator,
    value: stringValidator
};

const FIELDS_DEFAULT_VALUE = {
    options: '',
    regexCheck: '',
    value: '',
    min: '',
    max: '',
    step: ''
};

interface PropValidationInfo<T> {
    field: {
        type: string;
        name: string;
    };
    name: string;
    value: T;
}

class DotFieldPropError<T> extends Error {
    private readonly propInfo: PropValidationInfo<T>;

    constructor(propInfo: PropValidationInfo<T>, expectedType: string) {
        super(
            `Warning: Invalid prop "${propInfo.name}" of type "${typeof propInfo.value}" supplied to "${propInfo
                .field.type}" with the name "${propInfo.field.name}", expected "${expectedType}".
Doc Reference: https://github.com/dotCMS/core-web/blob/master/projects/dotcms-field-elements/src/components/${propInfo
                .field.type}/readme.md`
        );
        this.propInfo = propInfo;
    }

    getProps() {
        return { ...this.propInfo };
    }
}

function stringValidator<T>(propInfo: PropValidationInfo<T>): void {
    if (typeof propInfo.value !== 'string') {
        throw new DotFieldPropError(propInfo, 'string');
    }
}

function regexValidator<T>(propInfo: PropValidationInfo<T>): void {
    try {
        RegExp(propInfo.value.toString());
    } catch (e) {
        throw new DotFieldPropError(propInfo, 'valid regular expression');
    }
}

function numberValidator<T>(propInfo: PropValidationInfo<T>): void {
    if (isNaN(Number(propInfo.value))) {
        throw new DotFieldPropError(propInfo, 'Number');
    }
}

function dateValidator<T>(propInfo: PropValidationInfo<T>): void {
    if (!dotValidateDate(propInfo.value.toString())) {
        throw new DotFieldPropError(propInfo, 'Date');
    }
}

function timeValidator<T>(propInfo: PropValidationInfo<T>): void {
    if (!dotValidateTime(propInfo.value.toString())) {
        throw new DotFieldPropError(propInfo, 'Time');
    }
}

function dateTimeValidator<T>(propInfo: PropValidationInfo<T>): void {
    if (typeof propInfo.value === 'string') {
        const dateSlot = dotParseDate(propInfo.value.toString());
        if (!isValidDateSlot(dateSlot)) {
            throw new DotFieldPropError(propInfo, 'Date/Time');
        }
    } else {
        throw new DotFieldPropError(propInfo, 'Date/Time');
    }
}

export function dotPropValidator<T>(element: T, propertyName: string, validatorType?: string): any {
    const proInfo = getPropInfo<T>(element, propertyName);
    try {
        validateProp<T>(proInfo, validatorType);
        return element[propertyName];
    } catch (error) {
        console.warn(error.message);
        return FIELDS_DEFAULT_VALUE[propertyName];
    }
}

function validateProp<T>(proInfo: PropValidationInfo<T>, validatorType?: string): void {
    if (!!proInfo.value) {
        PROP_VALIDATION_HANDLING[validatorType || proInfo.name](proInfo);
    }
}

function getPropInfo<T>(element: T, propertyName: string): PropValidationInfo<T> {
    return {
        value: element[propertyName],
        name: propertyName,
        field: {
            name: element['name'],
            type: element['el'].tagName.toLocaleLowerCase()
        }
    };
}
