import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { Prop } from '@stencil/core';

describe('dot-textfield', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChange: EventSpy;

    const getLabel = async () => await page.find('label');

    //     /** Value specifies the value of the <input> element */
    // @Prop() name
    // @prop() label =
    // @Prop() placeholder
    // @Prop() hint
    // @Prop() required
    // @Prop() requiredMessage
    // @Prop() validationMessage
    // @Prop() disabled = false;
    // @Prop regexCheck = '';
    // @Prop() type = 'text';


    // beforeEach(async () => {
    //     page = await newE2EPage({
    //         html: `<dot-textfield></dot-textfield>`
    //     });
    //
    //     spyStatusChangeEvent = await page.spyOnEvent('statusChange');
    //     spyValueChange = await page.spyOnEvent('valueChange');
    //     element = await page.find('dot-textfield');
    //     input = await page.find('input');
    // });

    describe('@Props', () => {

        beforeEach(async () => {
            page = await newE2EPage({
                html: `<dot-textfield></dot-textfield>`
            });

            element = await page.find('dot-textfield');
            input = await page.find('input');
        });


        describe('value', () => {
            it('should set value correctly', async() => {
                element.setProperty('value', 'test');
                await page.waitForChanges();

                expect(await input.getProperty('value')).toBe('test');
            });
            it('should set object string value correctly', async() => {
                element.setProperty('value', {test: true});
                await page.waitForChanges();

                expect(await input.getProperty('value')).toBe('[object Object]');
            });
        });

        describe('name', () => {

            it('should render with valid value', async () => {
                element.setProperty('name', 'someCamelCas*eNa&me&$');
                await page.waitForChanges();
                const label = await getLabel();
                expect(await label.getAttribute('id')).toBe('label-somecamelcasename');
            });

            it('should not render when not defined', async () => {
                element.setProperty('name', undefined);
                await page.waitForChanges();
                const label = await getLabel();
                expect(await label.getAttribute('id')).toBe(null);
            });

            it('should not render with invalid value', async () => {
                element.setProperty('name', null);
                await page.waitForChanges();
                const label = await getLabel();
                expect(await label.getProperty('id')).toBe('');
            });
        });

        // describe('propety name 2', () => {
        //     xit('') {}
        //
        // })
    });

    // describe('@Events', () => {
    //     describe('status and value change', () => {
    //         xit('') {}
    //         xit('') {}
    //         xit('') {}
    //     })
    //
    //     describe('status change', () => {
    //         xit('') {}
    //     })
    //
    //     describe('value change', () => {
    //         xit('') {}
    //     })
    // })
    //
    // describe('@Method', () => {
    //     describe('method name', () => {
    //         xit('') {}
    //         xit('') {}
    //         xit('') {}
    //     })
    //
    //     describe('method name 2', () => {
    //         xit('') {}
    //     })
    // })

    /*xit('should render', () => {
        // tslint:disable-next-line:max-line-length
        const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"dot-fullName\">Name:</label><span class=\"dot-field__required-mark\">*</span></div><input id=\"dot-fullName\" placeholder=\"Enter Name\" required=\"\" type=\"text\"><span class=\"dot-field__hint\">this is a hint</span>`;
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });

    xit('should set type', async () => {
        element.setProperty('type', 'email');
        await page.waitForChanges();
        expect(await input.getProperty('type')).toBe('email');
    });

    xit('should show Regex validation message', async () => {
        await input.press('@');
        await page.waitForChanges();
        const errorMessage = await page.find('.dot-field__error-message');
        expect(errorMessage.innerHTML).toBe('Invalid Name');
    });

    xit('should load as pristine and untouched', () => {
        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
    });

    xit('should mark as dirty and touched when type', async () => {
        await input.press('a');
        await page.waitForChanges();
        expect(element).toHaveClasses(['dot-dirty', 'dot-touched']);
    });

    xit('should mark as invalid when value dont match REgex', async () => {
        await input.press('@');
        await page.waitForChanges();
        expect(element).toHaveClasses(['dot-invalid']);
    });

    xit('should clear value, set pristine and untouched  when input set reset', async () => {
        await element.callMethod('reset');
        await page.waitForChanges();

        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
        expect(element.classList.contains('dot-invalid')).toBe(true);
        expect(await input.getProperty('value')).toBe('');
    });

    xit('should mark as disabled when prop is present', async () => {
        element.setProperty('disabled', true);
        await page.waitForChanges();
        expect(await input.getProperty('disabled')).toBe(true);
    });

    xit('should mark as required when prop is present', async () => {
        expect(await input.getProperty('required')).toBe(true);
    });

    xit('should set the default value of regexCheck when the Regular Expression is not valid', async () => {
        element.setProperty('regexCheck', '[^(<[.\\n]+>)]*l');
        await page.waitForChanges();
        expect(await input.getProperty('regexCheck')).toBeUndefined();
    });

    describe('emit events', () => {
        xit('should mark as touched when onblur', async () => {
            await input.triggerEvent('blur');
            await page.waitForChanges();

            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                status: {
                    dotPristine: true,
                    dotTouched: true,
                    dotValid: true
                }
            });
        });

        xit('should send status and value change', async () => {
            await input.press('a');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                status: {
                    dotPristine: false,
                    dotTouched: true,
                    dotValid: true
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({
                name: 'fullName',
                value: 'Johna'
            });
        });

        xit('should emit status and value on Reset', async () => {
            await element.callMethod('reset');
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                status: {
                    dotPristine: true,
                    dotTouched: false,
                    dotValid: false
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({ name: 'fullName', value: '' });
        });
    });*/
});
