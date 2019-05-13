// export class DotFieldParamError extends Error {
//     constructor(propInfo: PropValidationInfo, expectedType: string) {
//         super(
//             `Warning: Invalid prop "${propInfo.name}" of type "${typeof propInfo.value}" supplied to "${propInfo.fieldType}" with the name "${propInfo.fieldName}", expected "${expectedType}"`
//         );
//         if (Error.captureStackTrace) {
//             Error.captureStackTrace(this, DotFieldParamError);
//         }
//     }
// }

const fieldValidationMap = {
    disabled: booleanValidator,
    required: booleanValidator,
    hint: stringValidator,
    label: stringValidator,
    name: stringValidator,
    requiredMessage: stringValidator,
    validationMessage: stringValidator
};

export interface PropValidationInfo {
    fieldType: string;
    fieldName: string;
    name: string;
    value: any;
}

function getError(propInfo: PropValidationInfo, expectedType: string): Error {
    throw new Error(
        `Warning: Invalid prop "${propInfo.name}" of type "${typeof propInfo.value}" supplied to "${propInfo.fieldType}" with the name "${propInfo.fieldName}", expected "${expectedType}".
        Doc Reference: https://github.com/dotCMS/core-web/blob/master/projects/dotcms-field-elements/src/components/${propInfo.fieldType}/readme.md`
    );
}

function booleanValidator(propInfo: PropValidationInfo): void {
    if (typeof propInfo.value !== 'boolean') {
        getError(propInfo, 'boolean');
    }
}

function stringValidator(propInfo: PropValidationInfo): void {
    if (typeof propInfo.value !== 'string') {
        getError(propInfo, 'string');
    }
}

export function dotPropValidator(propInfo: PropValidationInfo, oldValue: any): any {
    try {
        fieldValidationMap[propInfo.name](propInfo);
        return propInfo.value;
    } catch (error) {
        console.warn(error.message);
        return oldValue;
    }
}
