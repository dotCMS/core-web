export const DATE_REGEX = new RegExp('(19|20)\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])');
export const TIME_REGEX = new RegExp('^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$');

const PROP_VALIDATION_HANDLING = {
    date: dateValidator,
    number: numberValidator,
    options: stringValidator,
    time: timeValidator,
    regexCheck: regexValidator,
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

// function booleanValidator<T>(propInfo: PropValidationInfo<T>): void {
//     if (typeof propInfo.value !== 'boolean') {
//         throw new DotFieldPropError(propInfo, 'boolean');
//     }
// }
//

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
    if (propInfo.value && !DATE_REGEX.test(propInfo.value.toString())) {
        throw new DotFieldPropError(propInfo, 'Date');
    }
}

function timeValidator<T>(propInfo: PropValidationInfo<T>): void {
    if (propInfo.value && !TIME_REGEX.test(propInfo.value.toString())) {
        throw new DotFieldPropError(propInfo, 'Time');
    }
}

export function dotPropValidator<T>(element: T, propertyName: string, validatorType?: string): any {
    const proInfo = {
        value: element[propertyName],
        name: propertyName,
        field: {
            name: element['name'],
            type: element['el'].tagName.toLocaleLowerCase()
        }
    };

    try {
        PROP_VALIDATION_HANDLING[validatorType || propertyName](proInfo);
        return element[propertyName];
    } catch (error) {
        console.warn(error.message);
        return FIELDS_DEFAULT_VALUE[propertyName];
    }
}
