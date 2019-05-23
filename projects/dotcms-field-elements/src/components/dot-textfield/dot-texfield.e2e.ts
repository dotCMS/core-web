import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { dotTestUtil } from '../../utils';

describe('dot-textfield', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    describe('render CSS classes', () => {
        beforeEach(async () => {
            page = await newE2EPage();
        });

        describe('with data', () => {
            beforeEach(async () => {
                await page.setContent(`<dot-textfield value='John' required></dot-textfield>`);
                element = await page.find('dot-textfield');
                input = await page.find('input');
            });

            it('should be valid, untouched & pristine on load', async () => {
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });

            it('should be invalid, touched & dirty when valued is cleared and is required', async () => {
                element.setProperty('value', 'a');
                await page.waitForChanges();
                await input.press('Backspace');
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.emptyRequired);
            });

            it('should be invalid, untouched & pristine when empty on load  but required', async () => {
                element.setProperty('value', '');
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.emptyRequiredPristine);
            });
            it('should be valid, touched & dirty when filled', async () => {
                await input.press('a');
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.filled);
            });
        });

        describe('without data', () => {
            it('should be pristine, untouched & valid', async () => {
                await page.setContent(`<dot-textfield></dot-textfield>`);
                element = await page.find('dot-textfield');
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });
        });
    });

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
                await input.press('a');
                await page.waitForChanges();
                expect(await input.getProperty('value')).toBe('a');
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

                expect(input.getAttribute('id')).toBe('dot-text01');
            });

            it('should set name prop in dot-label', async () => {
                element.setProperty('name', 'text01');
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(await label.getAttribute('name')).toBe('text01');
            });

            it('should set name prop in dot-label with invalid value', async () => {
                element.setProperty('name', { test: 'hi' });
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(await label.getAttribute('name')).toBe('[object Object]');
            });

            it('should render when is a unexpected value', async () => {
                element.setProperty('name', { input: 'text01' });
                await page.waitForChanges();
                expect(input.getAttribute('id')).toBe('dot-object-object');
            });
        });

        describe('label', () => {
            it('should set label prop in dot-label', async () => {
                element.setProperty('label', 'Name:');
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(await label.getAttribute('label')).toBe('Name:');
            });
            it('should set label prop in dot-label when is a unexpected value', async () => {
                element.setProperty('label', [1, 2, 'test']);
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(await label.getAttribute('label')).toEqual('1,2,test');
            });
        });

        describe('placeholder', () => {
            it('should set placeholder correctly', async () => {
                element.setProperty('placeholder', 'Test');
                await page.waitForChanges();
                expect(input.getAttribute('placeholder')).toBe('Test');
            });
            it('should set placeholder correctly with invalid value', async () => {
                element.setProperty('placeholder', { test: 'hi' });
                await page.waitForChanges();
                expect(input.getAttribute('placeholder')).toBe('[object Object]');
            });
        });

        describe('hint', () => {
            it('should set hint correctly', async () => {
                element.setProperty('hint', 'Test');
                await page.waitForChanges();
                expect((await dotTestUtil.getHint(page)).innerText).toBe('Test');
            });

            it('should not render hint', async () => {
                expect(await dotTestUtil.getHint(page)).toBeNull();
            });

            it('should not render  hint with invalid value', async () => {
                element.setProperty('hint', { test: 'hint' });
                await page.waitForChanges();
                expect(await dotTestUtil.getHint(page)).toBeNull();
            });
        });

        describe('required', () => {
            it('should render required attribute and dot-required class', async () => {
                element.setProperty('required', 'true');
                await page.waitForChanges();
                expect(input.getAttribute('required')).toBeDefined();
                expect(element).toHaveClasses(['dot-required']);
            });

            it('should not render required attribute', async () => {
                element.setProperty('required', 'false');
                await page.waitForChanges();
                expect(input.getAttribute('required')).toBeNull();
            });

            it('should render required attribute with invalid value', async () => {
                element.setProperty('required', { test: 'test' });
                await page.waitForChanges();
                expect(input.getAttribute('required')).toBeDefined();
            });
        });

        describe('requiredMessage', () => {
            it('should render requiredMessage', async () => {
                element.setProperty('required', 'true');
                element.setProperty('requiredMessage', 'Test');
                await input.press('a');
                await input.press('Backspace');
                await page.waitForChanges();
                expect((await dotTestUtil.getErrorMessage(page)).innerText).toBe('Test');
            });

            it('should not render requiredMessage', async () => {
                await page.waitForChanges();
                expect(await dotTestUtil.getErrorMessage(page)).toBe(null);
            });

            it('should not render and not break with with invalid value', async () => {
                element.setProperty('required', 'true');
                element.setProperty('requiredMessage', { test: 'hi' });
                await input.press('a');
                await input.press('Backspace');
                await page.waitForChanges();
                expect(await dotTestUtil.getErrorMessage(page)).toBeNull();
            });
        });

        describe('regexCheck', () => {
            it('should set empty value when invalid regexCheck', async () => {
                element.setProperty('regexCheck', '[*');
                await page.waitForChanges();
                expect(await element.getProperty('regexCheck')).toBe('');
                expect(await dotTestUtil.getErrorMessage(page)).toBeNull();
            });
        });

        describe('validationMessage', () => {
            it('should render validationMessage', async () => {
                element.setProperty('regexCheck', '[0-9]');
                element.setProperty('validationMessage', 'Test');
                await input.press('a');
                await page.waitForChanges();
                expect((await dotTestUtil.getErrorMessage(page)).innerText).toBe('Test');
            });

            it('should not render validationMessage', async () => {
                await input.press('a');
                await page.waitForChanges();
                expect(await dotTestUtil.getErrorMessage(page)).toBeNull();
            });
        });

        describe('disabled', () => {
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

        describe('type', () => {
            it('should set value to text on default correctly', async () => {
                await page.waitForChanges();
                expect(input.getAttribute('type')).toBe('text');
            });

            it('should set value correctly', async () => {
                element.setProperty('type', 'email');
                await page.waitForChanges();
                expect(input.getAttribute('type')).toBe('email');
            });

            it('should render and not break when is a unexpected value', async () => {
                element.setProperty('type', { test: true });
                await page.waitForChanges();
                expect(input.getAttribute('type')).toBe('[object Object]');
            });
        });

        describe('@Events', () => {
            beforeEach(async () => {
                page = await newE2EPage();
                await page.setContent(`<dot-textfield></dot-textfield>`);

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
});
