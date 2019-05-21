import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { Prop } from '@stencil/core';

describe('dot-textfield', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChange: EventSpy;

    //     /** Value specifies the value of the <input> element */

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

    const getLabel = async () => await page.find('dot-label');
    const getHint = async () => await page.find('.dot-field__hint');

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage({
                html: `<dot-textfield></dot-textfield>`
            });

            element = await page.find('dot-textfield');
            input = await page.find('input');
        });

        describe('value', () => {
            it('should set value correctly', async () => {
                element.setProperty('value', 'test');
                await page.waitForChanges();

                expect(await input.getProperty('value')).toBe('test');
            });
            it('should render when is a unexpected value', async () => {
                element.setProperty('value', { test: true });
                await page.waitForChanges();

                expect(await input.getProperty('value')).toBe('[object Object]');
            });
        });

        describe('name', () => {
            it('should render with valid name', async () => {
                element.setProperty('name', 'text01');
                await page.waitForChanges();
                expect(await input.getProperty('id')).toBe('dot-text01');
            });

            it('should set name prop in dot-label', async () => {
                element.setProperty('name', 'text01');
                await page.waitForChanges();
                const label = await getLabel();
                expect(await label.getProperty('name')).toBe('text01');
            });
            it('should render when is a unexpected value', async () => {
                element.setProperty('name', { input: 'text01' });
                await page.waitForChanges();
                expect(await input.getProperty('id')).toBe('dot-object-object');
            });
        });

        describe('label', () => {
            it('should set label prop in dot-label', async () => {
                element.setProperty('label', 'Name:');
                await page.waitForChanges();
                const label = await getLabel();
                expect(await label.getProperty('label')).toBe('Name:');
            });
            it('should set label prop in dot-label when is a unexpected value', async () => {
                element.setProperty('label', [1, 2, 'test']);
                await page.waitForChanges();
                const label = await getLabel();
                expect(await label.getProperty('label')).toEqual([1, 2, 'test']);
            });
        });

        describe('placeholder', () => {
            it('should set placeholder correctly', async () => {
                element.setProperty('placeholder', 'Test');
                await page.waitForChanges();
                expect(await input.getProperty('placeholder')).toBe('Test');
            });
            it('should set placeholder correctly with invalid value', async () => {
                element.setProperty('placeholder', { test: 'hi' });
                await page.waitForChanges();
                expect(await input.getProperty('placeholder')).toBe('[object Object]');
            });
        });

        describe('hint', () => {
            it('should set hint correctly', async () => {
                element.setProperty('hint', 'Test');
                await page.waitForChanges();
                expect((await getHint()).innerHTML).toBe('Test');
            });

            it('should not render hint', async () => {
                expect(await getHint()).toBeNull();
            });

            it('should set hint correctly with invalid value', async () => {
                element.setProperty('hint', { test: 'hint' });
                await page.waitForChanges();
                console.log('element.outerHTML: ', element.outerHTML);
                expect((await getHint()).innerHTML).toBe('Test');
            });
        });

        //console.log('element.outerHTML: ', element.outerHTML);

        // describe('propety name 2', () => {
        //     xxit('') {}
        //
        // })
    });

    // describe('@Events', () => {
    //     describe('status and value change', () => {
    //         xxit('') {}
    //         xxit('') {}
    //         xxit('') {}
    //     })
    //
    //     describe('status change', () => {
    //         xxit('') {}
    //     })
    //
    //     describe('value change', () => {
    //         xxit('') {}
    //     })
    // })
    //
    // describe('@Method', () => {
    //     describe('method name', () => {
    //         xxit('') {}
    //         xxit('') {}
    //         xxit('') {}
    //     })
    //
    //     describe('method name 2', () => {
    //         xxit('') {}
    //     })
    // })

    /*xxit('should render', () => {
        // tslint:disable-next-line:max-line-length
        const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"dot-fullName\">Name:</label><span class=\"dot-field__required-mark\">*</span></div><input id=\"dot-fullName\" placeholder=\"Enter Name\" required=\"\" type=\"text\"><span class=\"dot-field__hint\">this is a hint</span>`;
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });

    xxit('should set type', async () => {
        element.setProperty('type', 'email');
        await page.waitForChanges();
        expect(await input.getProperty('type')).toBe('email');
    });

    xxit('should show Regex validation message', async () => {
        await input.press('@');
        await page.waitForChanges();
        const errorMessage = await page.find('.dot-field__error-message');
        expect(errorMessage.innerHTML).toBe('Invalid Name');
    });

    xxit('should load as pristine and untouched', () => {
        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
    });

    xxit('should mark as dirty and touched when type', async () => {
        await input.press('a');
        await page.waitForChanges();
        expect(element).toHaveClasses(['dot-dirty', 'dot-touched']);
    });

    xxit('should mark as invalid when value dont match REgex', async () => {
        await input.press('@');
        await page.waitForChanges();
        expect(element).toHaveClasses(['dot-invalid']);
    });

    xxit('should clear value, set pristine and untouched  when input set reset', async () => {
        await element.callMethod('reset');
        await page.waitForChanges();

        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
        expect(element.classList.contains('dot-invalid')).toBe(true);
        expect(await input.getProperty('value')).toBe('');
    });

    xxit('should mark as disabled when prop is present', async () => {
        element.setProperty('disabled', true);
        await page.waitForChanges();
        expect(await input.getProperty('disabled')).toBe(true);
    });

    xxit('should mark as required when prop is present', async () => {
        expect(await input.getProperty('required')).toBe(true);
    });

    xxit('should set the default value of regexCheck when the Regular Expression is not valid', async () => {
        element.setProperty('regexCheck', '[^(<[.\\n]+>)]*l');
        await page.waitForChanges();
        expect(await input.getProperty('regexCheck')).toBeUndefined();
    });

    describe('emit events', () => {
        xxit('should mark as touched when onblur', async () => {
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

        xxit('should send status and value change', async () => {
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

        xxit('should emit status and value on Reset', async () => {
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
