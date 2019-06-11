import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { dotTestUtil } from '../../utils';

const getOptions = (page: E2EPage) => page.findAll('input');

describe('dot-radio', () => {
    let page: E2EPage;
    let element: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    describe('render', () => {
        beforeEach(async () => {
            page = await newE2EPage();
        });

        describe('CSS classes', () => {
            it('should be valid, touched & dirty when picked an option', async () => {
                await page.setContent(`
                    <dot-radio
                        options="|,valueA|1,valueB|2"
                        value="2">
                    </dot-radio>`);
                const options = await getOptions(page);
                await options[1].click();
                await page.waitForChanges();
                element = await page.find('dot-radio');
                expect(element).toHaveClasses(dotTestUtil.class.filled);
            });

            it('should be valid, touched, dirty & required when picked an option', async () => {
                await page.setContent(`
                    <dot-radio
                        options="|,valueA|1,valueB|2"
                        required="true"
                        value="2">
                    </dot-radio>`);
                const options = await getOptions(page);
                await options[1].click();
                await page.waitForChanges();
                element = await page.find('dot-radio');
                expect(element).toHaveClasses(dotTestUtil.class.filledRequired);
            });

            it('should be valid, untouched, pristine & required when loaded', async () => {
                await page.setContent(`
                    <dot-radio
                        options="|,valueA|1,valueB|2"
                        required
                        value="2">
                    </dot-radio>`);
                element = await page.find('dot-radio');
                expect(element).toHaveClasses(dotTestUtil.class.filledRequiredPristine);
            });

            it('should be invalid, untouched, pristine & required when no option set on load', async () => {
                await page.setContent(`
                    <dot-radio
                        options="|,valueA|1,valueB|2"
                        required="true">
                    </dot-radio>`);
                element = await page.find('dot-radio');
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.emptyRequiredPristine);
            });

            it('should be pristine, untouched & valid when loaded with no options', async () => {
                await page.setContent(`<dot-radio></dot-radio>`);
                element = await page.find('dot-radio');
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });
        });
    });

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-radio></dot-radio>`);
            element = await page.find('dot-radio');
        });

        describe('disabled', () => {
            it('should render attribute', async () => {
                element.setProperty('options', 'valueA|1,valueB|2');
                element.setProperty('disabled', true);
                await page.waitForChanges();
                const htmlElements = await getOptions(page);
                expect(htmlElements[0].getAttribute('disabled')).toBeDefined();
                expect(htmlElements[1].getAttribute('disabled')).toBeDefined();
            });

            it('should not break with invalid data --> truthy', async () => {
                element.setProperty('options', 'valueA|1,valueB|2');
                element.setProperty('disabled', ['a', 'b']);
                await page.waitForChanges();
                const htmlElements = await getOptions(page);
                expect(htmlElements[0].getAttribute('disabled')).toBeDefined();
                expect(htmlElements[1].getAttribute('disabled')).toBeDefined();
            });

            it('should not break with invalid data --> falsy', async () => {
                element.setProperty('options', 'valueA|1,valueB|2');
                element.setProperty('disabled', 0);
                await page.waitForChanges();
                const htmlElements = await getOptions(page);
                expect(htmlElements[0].getAttribute('disabled')).toBeNull();
                expect(htmlElements[1].getAttribute('disabled')).toBeNull();
            });
        });

        describe('name', () => {
            const value = 'test';

            it('should render attribute in label and select', async () => {
                element.setProperty('options', 'valueA|1');
                element.setProperty('name', value);
                await page.waitForChanges();
                const option = await getOptions(page);
                const nameValue = option[0].getAttribute('name');
                expect(nameValue).toBe('dot-test');
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('name')).toBe(value);
            });

            it('should not render attribute in label and select', async () => {
                element.setProperty('options', 'valueA|1');
                await page.waitForChanges();
                const option = await getOptions(page);
                const nameValue = option[0].getAttribute('name');
                expect(nameValue).toBeNull();
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('name')).toBe('');
            });

            it('should not break with invalid data', async () => {
                element.setProperty('options', 'valueA|1');
                const wrongValue = [1, 2, '3'];
                element.setProperty('name', wrongValue);
                await page.waitForChanges();
                const option = await getOptions(page);
                const nameValue = option[0].getAttribute('name');
                expect(nameValue).toBe('dot-123');
            });
        });

        describe('label', () => {
            it('should render attribute in label', async () => {
                const value = 'test';
                element.setProperty('label', value);
                await page.waitForChanges();
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('label')).toBe(value);
            });

            it('should not break with invalid data', async () => {
                const wrongValue = [1, 2, '3'];
                element.setProperty('label', wrongValue);
                await page.waitForChanges();
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('label')).toEqual('1,2,3');
            });
        });

        describe('hint', () => {
            it('should render hint and aria attr', async () => {
                const value = 'test';
                element.setProperty('hint', value);
                await page.waitForChanges();
                const hintElement = await dotTestUtil.getHint(page);
                const radioContainer = await page.find('.dot-radio__items');
                expect(hintElement.innerText).toBe(value);
                expect(radioContainer.getAttribute('aria-describedby')).toBe('hint-test');
                expect(radioContainer.getAttribute('tabIndex')).toBe('0');
                expect(radioContainer.getAttribute('role')).toBe('radiogroup');
            });

            it('should not render hint and aria attr', async () => {
                const hintElement = await dotTestUtil.getHint(page);
                const radioContainer = await page.find('.dot-radio__items');
                expect(hintElement).toBeNull();
                expect(radioContainer.getAttribute('aria-describedby')).toBeNull();
                expect(radioContainer.getAttribute('tabIndex')).toBeNull();
            });

            it('should not break and not render with invalid data', async () => {
                const wrongValue = [1, 2, 3];
                element.setProperty('hint', wrongValue);
                const hintElement = await dotTestUtil.getHint(page);
                expect(hintElement).toBeNull();
            });
        });

        describe('options', () => {
            it('should render options', async () => {
                const value = 'a|1,b|2,c|3';
                element.setProperty('options', value);
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(optionElements.length).toBe(3);
            });

            it('should not render options', async () => {
                const optionElements = await getOptions(page);
                expect(optionElements.length).toBe(0);
            });

            it('should not break with invalid data', async () => {
                const wrongValue = { a: '1' };
                element.setProperty('options', wrongValue);
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(optionElements.length).toBe(0);
            });
        });

        describe('required', () => {
            it('should render required attribute in label and dot-required css class', async () => {
                element.setProperty('required', true);
                await page.waitForChanges();
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(element).toHaveClasses(['dot-required']);
                expect(labelElement.getAttribute('required')).toBeDefined();
            });

            it('should not render required error msg', async () => {
                const errorElement = await dotTestUtil.getErrorMessage(page);
                expect(errorElement).toBeNull();
            });

            it('should not break and not render with invalid data', async () => {
                const wrongValue = [1, 2, 3];
                element.setProperty('required', wrongValue);
                await page.waitForChanges();
                const errorElement = await dotTestUtil.getErrorMessage(page);
                expect(errorElement).toBeNull();
            });
        });

        describe('requiredMessage', () => {
            it('should not break and not render with invalid data', async () => {
                const wrongValue = [1, 2, '3'];
                element.setProperty('requiredMessage', wrongValue);
                await page.waitForChanges();
                const errorElement = await dotTestUtil.getErrorMessage(page);
                expect(errorElement).toBeNull();
            });
        });

        describe('required & requiredMessage', () => {
            it('should not break and not render with invalid data', async () => {
                const wrongValue = [{ a: 1 }];
                element.setProperty('required', wrongValue);
                element.setProperty('requiredMessage', wrongValue);
                await page.waitForChanges();
                const errorElement = await dotTestUtil.getErrorMessage(page);
                expect(errorElement).toBeNull();
            });
        });

        describe('value', () => {
            it('should render option as selected', async () => {
                element.setProperty('options', 'a|1,b|2');
                element.setProperty('value', '2');
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('checked')).toBe(false);
                expect(await optionElements[1].getProperty('checked')).toBe(true);
            });

            it('should render options with no option selected (component\'s default behaviour)', async () => {
                element.setProperty('options', 'a|1,b|2,c|3');
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('checked')).toBe(false);
                expect(await optionElements[1].getProperty('checked')).toBe(false);
                expect(await optionElements[2].getProperty('checked')).toBe(false);
            });

            it('should not break with wrong data format', async () => {
                element.setProperty('options', 'a1,2,c|3');
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(optionElements.length).toBe(0);
            });

            it('should not break with wrong data type', async () => {
                const wrongValue = [{ a: 1 }];
                element.setProperty('options', 'a|1,b|2,c|3');
                element.setProperty('value', wrongValue);
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('checked')).toBe(false);
                expect(await optionElements[1].getProperty('checked')).toBe(false);
                expect(await optionElements[2].getProperty('checked')).toBe(false);
            });
        });
    });

    describe('@Events', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`
            <dot-radio
                name="testName"
                options="|,valueA|1,valueB|2"
                value="2">
            </dot-radio>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-radio');
        });

        describe('status and value change', () => {
            it('should emit when option selected', async () => {
                const optionElements = await getOptions(page);
                await optionElements[1].click();
                expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                    name: 'testName',
                    status: {
                        dotPristine: false,
                        dotTouched: true,
                        dotValid: true
                    }
                });
                expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                    name: 'testName',
                    value: '1'
                });
            });
        });
    });

    describe('@Methods', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`
            <dot-radio
                name="testName"
                options="value|0,valueA|1,valueB|2">
            </dot-radio>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-radio');
        });

        describe('Reset', () => {
            it('should emit StatusChange & ValueChange Events', async () => {
                await element.callMethod('reset');
                expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                    name: 'testName',
                    status: {
                        dotPristine: true,
                        dotTouched: false,
                        dotValid: true
                    }
                });
                expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                    name: 'testName',
                    value: ''
                });
            });

            it('should select no value', async () => {
                await element.callMethod('reset');
                await page.waitForChanges();
                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('checked')).toBe(false);
                expect(await optionElements[1].getProperty('checked')).toBe(false);
                expect(await optionElements[2].getProperty('checked')).toBe(false);
            });
        });
    });
});
