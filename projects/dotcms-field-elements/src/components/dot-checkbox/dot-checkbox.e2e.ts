import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { dotTestUtil } from '../../utils';

const getOptions = (page: E2EPage) => page.findAll('input');

describe('dot-checkbox', () => {
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
                    <dot-checkbox
                        options="|,valueA|1,valueB|2"
                        value="2">
                    </dot-checkbox>`);
                const options = await getOptions(page);
                await options[1].click();
                await page.waitForChanges();
                element = await page.find('dot-checkbox');
                expect(element).toHaveClasses(dotTestUtil.class.filled);
            });

            it('should be invalid, touched & dirty when no option set', async () => {
                await page.setContent(`
                    <dot-checkbox
                        options="|,valueA|1,valueB|2"
                        value="2"
                        required="true">
                    </dot-checkbox>`);
                element = await page.find('dot-checkbox');
                const options = await getOptions(page);
                await options[2].click();
                await page.waitForChanges();
                expect(element).toHaveClasses([...dotTestUtil.class.emptyRequired, 'dot-required']);
            });

            it('should be pristine, untouched & valid when loaded with no options', async () => {
                await page.setContent(`<dot-checkbox></dot-checkbox>`);
                element = await page.find('dot-checkbox');
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });
        });
    });

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-checkbox></dot-checkbox>`);
            element = await page.find('dot-checkbox');
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
                const idValue = option[0].getAttribute('id');
                expect(idValue).toBe('dot-test');
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('name')).toBe(value);
            });

            it('should not render attribute in label and select', async () => {
                element.setProperty('options', 'valueA|1');
                await page.waitForChanges();
                const option = await getOptions(page);
                const idValue = option[0].getAttribute('id');
                expect(idValue).toBeNull();
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('name')).toBe('');
            });

            it('should not break with invalid data', async () => {
                element.setProperty('options', 'valueA|1');
                const wrongValue = [1, 2, 3];
                element.setProperty('name', wrongValue);
                await page.waitForChanges();
                const option = await getOptions(page);
                const idValue = option[0].getAttribute('id');
                expect(idValue).toBe('dot-123');
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
            it('should render hint', async () => {
                const value = 'test';
                element.setProperty('hint', value);
                await page.waitForChanges();
                const hintElement = await dotTestUtil.getHint(page);
                expect(hintElement.innerText).toBe(value);
            });

            it('should not render hint', async () => {
                const hintElement = await dotTestUtil.getHint(page);
                expect(hintElement).toBeNull();
            });

            it('should not break and not render with invalid data', async () => {
                const wrongValue = [1, 2, '3'];
                element.setProperty('hint', wrongValue);
                await page.waitForChanges();
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
                const wrongValue = [1, 2, '3'];
                element.setProperty('required', wrongValue);
                await page.waitForChanges();
                const errorElement = await dotTestUtil.getErrorMessage(page);
                expect(errorElement.innerText).toBe('This field is required');
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
            it('should render required error msg', async () => {
                element.setProperty('required', true);
                element.setProperty('requiredMessage', 'test');
                await page.waitForChanges();
                const errorElement = await dotTestUtil.getErrorMessage(page);
                expect(errorElement.innerText).toBe('test');
            });

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
            <dot-checkbox
                name="testName"
                options="|,valueA|1,valueB|2"
                value="2">
            </dot-checkbox>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-checkbox');
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
                    value: '2,1'
                });
            });

            it('should emit empty value when none checked', async () => {
                const optionElements = await getOptions(page);
                await optionElements[2].click();
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
                    value: ''
                });
            });
        });
    });

    describe('@Methods', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`
            <dot-checkbox
                name="testName"
                options="|,valueA|1,valueB|2"
                value="2">
            </dot-checkbox>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-checkbox');
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

            it('should set first select value', async () => {
                await element.callMethod('reset');
                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('checked')).toBe(true);
                expect(await optionElements[1].getProperty('checked')).toBe(false);
                expect(await optionElements[2].getProperty('checked')).toBe(false);
            });
        });
    });
});
