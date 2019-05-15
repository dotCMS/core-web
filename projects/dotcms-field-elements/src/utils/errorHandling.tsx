const propValidationHandling = {
    options: stringValidator,
    regexCheck: regexValidator
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
        throw new DotFieldPropError(propInfo, 'regular expression');
    }
}


export function dotPropValidator<T>(propInfo: PropValidationInfo<T>): any {
    try {
        propValidationHandling[propInfo.name](propInfo);
        return propInfo.value;
    } catch (error) {
        console.warn(error.message);
        return null;
    }
}
