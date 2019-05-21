import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-textfield', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    const getLabel = async () => await page.find('dot-label');
    const getHint = async () => await page.find('.dot-field__hint');
    const getErrorMessage = async () => await page.find('.dot-field__error-message');

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
            it('should render and not break when is a unexpected value', async () => {
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

            it('should not render  hint with invalid value', async () => {
                element.setProperty('hint', { test: 'hint' });
                await page.waitForChanges();
                expect(await getHint()).toBeNull();
            });
        });

        describe('required', () => {
            it('should render required attribute', async () => {
                element.setProperty('required', 'true');
                await page.waitForChanges();
                expect(await input.getProperty('required')).toBe(true);
            });

            it('should not render required attribute', async () => {
                element.setProperty('required', 'false');
                await page.waitForChanges();
                expect(await input.getProperty('required')).toBe(false);
            });

            it('should render required attribute with invalid value', async () => {
                element.setProperty('required', { test: 'test' });
                await page.waitForChanges();
                expect(await input.getProperty('required')).toBe(true);
            });
        });

        describe('requiredMessage', () => {
            it('should render requiredMessage', async () => {
                element.setProperty('required', 'true');
                element.setProperty('requiredMessage', 'Test');
                await input.press('a');
                await input.press('Backspace');
                await page.waitForChanges();
                expect((await getErrorMessage()).innerHTML).toBe('Test');
            });

            it('should not render requiredMessage', async () => {
                await page.waitForChanges();
                expect(await getErrorMessage()).toBe(null);
            });

            it('should not render and not break with with invalid value', async () => {
                element.setProperty('required', 'true');
                element.setProperty('requiredMessage', { test: 'hi' });
                await input.press('a');
                await input.press('Backspace');
                await page.waitForChanges();
                expect(await getErrorMessage()).toBeNull();
            });
        });

        describe('regexCheck && validationMessage', () => {
            it('should render validationMessage', async () => {
                element.setProperty('regexCheck', '[0-9]');
                element.setProperty('validationMessage', 'Test');
                await input.press('a');
                await page.waitForChanges();
                expect((await getErrorMessage()).innerHTML).toBe('Test');
            });

            it('should not render validationMessage', async () => {
                await page.waitForChanges();
                expect(await getErrorMessage()).toBeNull();
            });

            it('should not render and not break with with invalid regexCheck', async () => {
                element.setProperty('regexCheck', '[*');
                await page.waitForChanges();
                expect(await element.getProperty('regexCheck')).toBe('');
                expect(await getErrorMessage()).toBeNull();
            });
        });

        describe('disabled', () => {
            it('should render disabled attribute', async () => {
                element.setProperty('disabled', 'true');
                await page.waitForChanges();
                expect(await input.getProperty('disabled')).toBe(true);
            });

            it('should not render disabled attribute', async () => {
                element.setProperty('disabled', 'false');
                await page.waitForChanges();
                expect(await input.getProperty('disabled')).toBe(false);
            });

            it('should render disabled attribute with invalid value', async () => {
                element.setProperty('disabled', { test: 'test' });
                await page.waitForChanges();
                expect(await input.getProperty('disabled')).toBe(true);
            });
        });

        describe('type', () => {
            it('should set value to text on default correctly', async () => {
                await page.waitForChanges();
                expect(await input.getProperty('type')).toBe('text');
            });

            it('should set value correctly', async () => {
                element.setProperty('type', 'email');
                await page.waitForChanges();
                expect(await input.getProperty('type')).toBe('email');
            });

            it('should render and not break when is a unexpected value', async () => {
                element.setProperty('type', { test: true });
                await page.waitForChanges();
                expect(await input.getProperty('type')).toBe('text');
            });
        });

        describe('@Events', () => {
            beforeEach(async () => {
                page = await newE2EPage();
                await page.setContent(`
                <dot-textfield
                    label='Name:'
                    name='fullName'
                    value='John'
                    hint='this is a hint'
                    placeholder='Enter Name'
                    regex-check='^[A-Za-z]+$'
                    validation-message="Invalid Name"
                    required
                    required-message="Required Name">
                </dot-textfield>`);

                spyStatusChangeEvent = await page.spyOnEvent('statusChange');
                spyValueChangeEvent = await page.spyOnEvent('valueChange');

                element = await page.find('dot-textfield');
                input = await page.find('input');
            });

            describe('status and value change', () => {
                it('should send status and value change', async () => {
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
                    expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                        name: 'fullName',
                        value: 'Johna'
                    });
                });

                it('should emit status and value on Reset', async () => {
                    await element.callMethod('reset');
                    expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                        name: 'fullName',
                        status: {
                            dotPristine: true,
                            dotTouched: false,
                            dotValid: false
                        }
                    });
                    expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                        name: 'fullName',
                        value: ''
                    });
                });
            });

            describe('status change', () => {
                it('should mark as touched when onblur', async () => {
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
            });
        });
    });
});
