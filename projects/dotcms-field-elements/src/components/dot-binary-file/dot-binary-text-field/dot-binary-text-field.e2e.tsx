import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { dotTestUtil } from '../../../utils';

const CLIPBOARD_URL_EVENT = {
    clipboardData: {
        items: [{ getAsString: callback => callback('test.pdf') }]
    }
};

const CLIPBOARD_FILE_EVENT = {
    clipboardData: {
        items: [
            { getAsString: callback => callback('test.pdf') },
            {
                getAsFile: () => {
                    return { file: 'test' };
                }
            }
        ],
        files: [{ file: 'test' }]
    }
};

describe('dot-binary-text-field', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `<dot-binary-file></dot-binary-file>`
        });

        element = await page.find('dot-binary-text-field');
        input = await page.find('input');
    });

    // describe('render CSS classes', () => {
    //     it('should be valid, untouched & pristine on load', async () => {
    //         await page.waitForChanges();
    //         expect(element).toHaveClasses(dotTestUtil.class.empty);
    //     });
    //
    //     it('should be valid, touched & dirty when filled', async () => {
    //         await inputText.triggerEvent('paste', CLIPBOARD_URL_EVENT);
    //         await page.waitForChanges();
    //         expect(element).toHaveClasses(dotTestUtil.class.filled);
    //     });
    //
    //     xit('should have touched but pristine on blur', async () => {
    //         await input.triggerEvent('blur');
    //         await page.waitForChanges();
    //         expect(element).toHaveClasses(dotTestUtil.class.touchedPristine);
    //     });
    //
    //     describe('required', () => {
    //         beforeEach(async () => {
    //             element.setProperty('required', 'true');
    //         });
    //
    //         it('should be valid, untouched & pristine and required when filled on load', async () => {
    //             element.setProperty('value', 'ab');
    //             await page.waitForChanges();
    //             expect(element).toHaveClasses(dotTestUtil.class.filledRequiredPristine);
    //         });
    //
    //         it('should be valid, touched & dirty and required when filled', async () => {
    //             await input.press('a');
    //             await page.waitForChanges();
    //             expect(element).toHaveClasses(dotTestUtil.class.filledRequired);
    //         });
    //
    //         it('should be invalid, untouched, pristine and required when empty on load', async () => {
    //             element.setProperty('value', '');
    //             await page.waitForChanges();
    //             expect(element).toHaveClasses(dotTestUtil.class.emptyRequiredPristine);
    //         });
    //
    //         it('should be invalid, touched, dirty and required when valued is cleared', async () => {
    //             element.setProperty('value', 'a');
    //             await page.waitForChanges();
    //             await input.press('Backspace');
    //             await page.waitForChanges();
    //             expect(element).toHaveClasses(dotTestUtil.class.emptyRequired);
    //         });
    //     });
    // });

    describe('@Props', () => {
        describe('value', () => {
            it('should set value correctly', async () => {
                element.setProperty('value', 'hi');
                await page.waitForChanges();
                expect(await input.getProperty('value')).toBe('hi');
            });
            it('should render and not break when is a unexpected value', async () => {
                element.setProperty('value', { test: true });
                await page.waitForChanges();
                expect(await input.getProperty('value')).toBe('[object Object]');
            });
        });

        describe('placeholder', () => {
            it('should render default placeholder correctly', () => {
                expect(input.getAttribute('placeholder')).toBe(
                    'Attach files by dragging & dropping, selecting or pasting them.'
                );
            });
            it('should set placeholder correctly', async () => {
                element.setProperty('placeholder', 'Test');
                await page.waitForChanges();
                expect(input.getAttribute('placeholder')).toBe('Test');
            });
            it('should render and not break when is a unexpected value', async () => {
                element.setProperty('placeholder', { test: true });
                await page.waitForChanges();
                expect(await input.getProperty('placeholder')).toBe('[object Object]');
            });
        });

        describe('required', () => {
            it('should not render required attribute by default', () => {
                expect(input.getAttribute('required')).toBeNull();
            });

            it('should render required attribute with invalid value', async () => {
                element.setProperty('required', { test: 'test' });
                await page.waitForChanges();
                expect(input.getAttribute('required')).toBeDefined();
            });

            it('should not render required attribute', async () => {
                element.setProperty('required', 'false');
                await page.waitForChanges();
                expect(input.getAttribute('required')).toBeNull();
            });
        });

        describe('accept', () => {});

        describe('disabled', () => {
            it('should not render disabled attribute by default', () => {
                expect(input.getAttribute('disabled')).toBeNull();
            });

            it('should render disabled attribute', async () => {
                element.setProperty('disabled', 'true');
                await page.waitForChanges();
                expect(input.getAttribute('disabled')).toBeDefined();
            });

            it('should not render disabled attribute', async () => {
                element.setProperty('disabled', 'false');
                await page.waitForChanges();
                expect(input.getAttribute('disabled')).toBeNull();
            });

            it('should render disabled attribute with invalid value', async () => {
                element.setProperty('disabled', { test: 'test' });
                await page.waitForChanges();
                expect(input.getAttribute('disabled')).toBeDefined();
            });
        });
    });

    describe('@Events', () => {
        beforeEach(async () => {
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');
        });

        describe('drag & drop', () => {});

        describe('paste', () => {});

        describe('status and value change', () => {
            it('should display on wrapper not valid css classes when loaded when required and no value set', async () => {
                page = await newE2EPage({
                    html: `
                <dot-form>
                    <dot-textfield required="true" ></dot-textfield>
                </dot-form>`
                });
                const form = await page.find('dot-form');
                expect(form).toHaveClasses(dotTestUtil.class.emptyPristineInvalid);
            });

            it('should send status and value change', async () => {
                await input.press('a');
                await page.waitForChanges();
                expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                    name: '',
                    status: {
                        dotPristine: false,
                        dotTouched: true,
                        dotValid: true
                    }
                });
                expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                    name: '',
                    value: 'a'
                });
            });

            it('should emit status and value on Reset', async () => {
                await element.callMethod('reset');
                expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                    name: '',
                    status: {
                        dotPristine: true,
                        dotTouched: false,
                        dotValid: true
                    }
                });
                expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                    name: '',
                    value: ''
                });
            });
        });

        describe('status change', () => {
            it('should mark as touched when onblur', async () => {
                await input.triggerEvent('blur');
                await page.waitForChanges();

                expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                    name: '',
                    status: {
                        dotPristine: true,
                        dotTouched: true,
                        dotValid: true
                    }
                });
            });
        });
    });
});
