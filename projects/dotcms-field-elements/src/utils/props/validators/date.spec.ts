import {
    dotValidateDate,
    dotValidateTime,
    dotParseDate,
    isValidDateSlot
} from './date';
import { DotDateSlot } from '../../../models';

const dateSlot: DotDateSlot = { time: '10:10:10', date: '2019-10-10' };
const onlyDate: DotDateSlot = { time: null, date: dateSlot.date };
const onlyTime: DotDateSlot = { time: dateSlot.time, date: null };
const emptySlot: DotDateSlot = { time: null, date: null };

xdescribe('Date Validators', () => {
    xdescribe('dotValidateDate', () => {
        it('should return the date when is valid ', () => {
            expect(dotValidateDate(dateSlot.date)).toBe(dateSlot.date);
        });

        it('should return null when is invalid date', () => {
            expect(dotValidateDate('test,h')).toBeNull();
        });
    });

    xdescribe('dotValidateTime', () => {
        it('should return the time when is valid', () => {
            expect(dotValidateTime(dateSlot.time)).toBe(dateSlot.time);
        });

        it('should return null when value is incomplete', () => {
            expect(dotValidateTime('1:00:00')).toBeNull();
        });

        it('should return null when is an invalid time', () => {
            expect(dotValidateTime('test')).toBeNull();
        });
    });

    xdescribe('dotParseDate', () => {
        it('should return DateSlot with date and time when value is valid', () => {
            expect(dotParseDate(`${dateSlot.date} ${dateSlot.time}`)).toEqual(dateSlot);
        });

        it('should return DateSlot with date  when value is valid', () => {
            expect(dotParseDate(dateSlot.date)).toEqual({ date: dateSlot.date, time: null });
        });

        it('should return DateSlot with time when value is valid', () => {
            expect(dotParseDate(dateSlot.time)).toEqual({ date: null, time: dateSlot.time });
        });

        it('should return empty DateSlot with invalid values', () => {
            expect(dotParseDate('a b c')).toEqual(emptySlot);
        });
    });

    xdescribe('isValidDateSlot', () => {
        it('should return true if date and time are valid', () => {
            expect(isValidDateSlot(dateSlot, `${dateSlot.date} ${dateSlot.time}`)).toBe(true);
        });

        it('should return true if date or time are valid', () => {
            expect(isValidDateSlot(onlyDate, dateSlot.date)).toBe(true);
            expect(isValidDateSlot(onlyTime, dateSlot.time)).toBe(true);
        });

        it('should return false if raw data contains date and time and slot only one of them', () => {
            expect(isValidDateSlot(onlyDate, `${dateSlot.date} ${dateSlot.time}`)).toBe(false);
        });
    });
});
