import {
    getClassNames,
    getDotOptionsFromFieldValue,
    getErrorClass,
    getHintId,
    getId,
    getLabelId,
    getOriginalStatus,
    getStringFromDotKeyArray,
    getTagError,
    getTagHint,
    updateStatus
} from './utils';

describe('getClassNames', () => {
    it('should returns field CSS classes', () => {
        const status = { dotValid: false, dotTouched: false, dotPristine: true };
        expect(getClassNames(status, true)).toEqual({
            'dot-valid': true,
            'dot-invalid': false,
            'dot-pristine': true,
            'dot-dirty': false,
            'dot-touched': false,
            'dot-untouched': true
        });
    });
});

describe('getDotOptionsFromFieldValue', () => {
    it('should return label/value', () => {
        const items = getDotOptionsFromFieldValue('key1|A,key2|B');
        expect(items.length).toBe(2);
        expect(items).toEqual([{ label: 'key1', value: 'A' }, { label: 'key2', value: 'B' }]);
    });
});

describe('getErrorClass', () => {
    it('should returns Error CSS', () => {
        expect(getErrorClass(false)).toEqual('dot-field__error');
    });
    it('should Not returns Error CSS', () => {
        expect(getErrorClass(true)).toBeUndefined();
    });
});

describe('getHintId', () => {
    it('should return hint id correctly', () => {
        expect(getHintId('***^^^HelloWorld123$$$###')).toEqual('hint-helloworld123');
    });

    it('should return undefined', () => {
        expect(getHintId('')).toBeUndefined();
    });
});

describe('getId', () => {
    it('should return id', () => {
        expect(
            getId('some123Name#$%^&')
        ).toBe('dot-some123name');
    });
});

describe('getLabelId', () => {
    it('should return label id correctly', () => {
        expect(getLabelId('***^^^HelloWorld123$$$###')).toEqual('label-helloworld123');
    });

    it('should return undefined', () => {
        expect(getLabelId('')).toBeUndefined();
    });
});

describe('getOriginalStatus', () => {
    it('should returns initial field Status', () => {
        expect(getOriginalStatus()).toEqual({
            dotValid: true,
            dotTouched: false,
            dotPristine: true
        });
    });
    it('should returns field Status with overwrite dotValid equal false', async () => {
        expect(getOriginalStatus(false)).toEqual({
            dotValid: false,
            dotTouched: false,
            dotPristine: true
        });
    });
});

describe('getStringFromDotKeyArray', () => {
    it('should transform to string', () => {
        expect(
            getStringFromDotKeyArray([
                {
                    key: 'some1',
                    value: 'val1'
                },
                {
                    key: 'some45',
                    value: 'val99'
                }
            ])
        ).toBe('some1|val1,some45|val99');
    });
});

describe('getTagError', () => {
    it('should returns Error tag', () => {
        const message = 'Error Msg';
        const jsxTag: any = getTagError(true, message);
        expect(jsxTag.vattrs).toEqual({ class: 'dot-field__error-message' });
        expect(jsxTag.vchildren).toEqual([{ vtext: message }]);
    });
    it('should Not returns Error tag', () => {
        expect(getTagError(false, 'Error Msg')).toEqual(null);
    });
});

describe('getTagHint', () => {
    it('should returns Hint tag', () => {
        const jsxTag: any = getTagHint('Hint', '@@some***Name##123');
        expect(jsxTag.vattrs).toEqual({ class: 'dot-field__hint', id: 'hint-somename123' });
        expect(jsxTag.vchildren).toEqual([{ vtext: 'Hint' }]);
    });
    it('should Not returns Hint tag', () => {
        expect(getTagHint('', 'someName')).toBeNull();
    });
});

describe('updateStatus', () => {
    it('should returns updated field Status', () => {
        const status = { dotValid: false, dotTouched: false, dotPristine: true };
        expect(updateStatus(status, { dotTouched: true })).toEqual({
            dotValid: false,
            dotTouched: true,
            dotPristine: true
        });
    });
});
