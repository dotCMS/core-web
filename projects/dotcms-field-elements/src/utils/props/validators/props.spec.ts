import { PropValidationInfo } from '../models';
import {
    dateRangeValidator,
    dateTimeValidator,
    dateValidator,
    numberValidator,
    regexValidator,
    stringValidator,
    timeValidator
} from './props';

describe('Props Validators', () => {
    let propInfo: PropValidationInfo<any>;

    beforeEach(async () => {
        propInfo = {
            field: { type: 'test-type', name: 'field-name' },
            name: 'test-name',
            value: 'test-value'
        };
    });

    describe('stringValidator', () => {
        it('should not trow throw Warning exception when value is a string', () => {
            expect(() => stringValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception when value is not a string', () => {
            propInfo.value = {};
            expect(() => stringValidator(propInfo)).toThrowError();
        });
    });

    describe('regexValidator', () => {
        it('should not trow throw Warning exception when Regular Expression is valid', () => {
            propInfo.value = '[0-9]';
            expect(() => regexValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception when when Regular Expression is invalid', () => {
            propInfo.value = '[*';
            expect(() => regexValidator(propInfo)).toThrowError();
        });
    });

    describe('numberValidator', () => {
        it('should not trow throw Warning exception when is a Number', () => {
            propInfo.value = 123;
            expect(() => numberValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception when when is not a Number', () => {
            expect(() => numberValidator(propInfo)).toThrowError();
        });
    });

    describe('dateValidator', () => {
        it('should not trow throw Warning exception when is a valid Date', () => {
            propInfo.value = '2010-10-10';
            expect(() => dateValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception when when is a invalid Date', () => {
            expect(() => dateValidator(propInfo)).toThrowError();
        });
    });

    describe('dateRangeValidator', () => {
        it('should not trow throw Warning exception when Dates are valid', () => {
            propInfo.value = '2010-10-10,2010-11-11';
            expect(() => dateRangeValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception when when second Date is higher than first', () => {
            propInfo.value = '2010-11-12,2010-10-10';
            expect(() => dateRangeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception when when fist Date is not valid', () => {
            propInfo.value = 'A2010-10-10,2010-11-12';
            expect(() => dateRangeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception when when second  Date is not valid', () => {
            propInfo.value = '2010-10-10,B2010-11-12';
            expect(() => dateRangeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception when value are not dates', () => {
            expect(() => dateRangeValidator(propInfo)).toThrowError();
        });
    });

    describe('timeValidator', () => {
        it('should not trow throw Warning exception when is a valid Time', () => {
            propInfo.value = '10:10:10';
            expect(() => timeValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception when when is a invalid Time', () => {
            expect(() => timeValidator(propInfo)).toThrowError();
        });
    });

    describe('dateTimeValidator', () => {
        it('should not trow throw Warning exception when is a valid Date and Time', () => {
            propInfo.value = '2010-10-10 10:10:10';
            expect(() => dateTimeValidator(propInfo)).not.toThrowError();
        });

        it('should not trow throw Warning exception when is a valid Date', () => {
            propInfo.value = '2010-10-10';
            expect(() => dateTimeValidator(propInfo)).not.toThrowError();
        });

        it('should not trow throw Warning exception when is a valid Time', () => {
            propInfo.value = '10:10:10';
            expect(() => dateTimeValidator(propInfo)).not.toThrowError();
        });

        it('should throw Warning exception ONLY when only Date is invalid', () => {
            propInfo.value = '2010-99-10 10:10:10';
            expect(() => dateTimeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception when Date is invalid', () => {
            propInfo.value = '2010-99-10';
            expect(() => dateTimeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception ONLY when Time is invalid', () => {
            propInfo.value = '2010-99-10 1:10:10';
            expect(() => dateTimeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception when Time is invalid', () => {
            propInfo.value = '1:10:10';
            expect(() => dateTimeValidator(propInfo)).toThrowError();
        });

        it('should throw Warning exception when value is invalid', () => {
            expect(() => dateTimeValidator(propInfo)).toThrowError();
        });
    });
});
