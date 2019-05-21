import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

const getSelect = (page: E2EPage) => page.find('select');
const getDotLabel = (page: E2EPage) => page.find('dot-label');
const getHint = (page: E2EPage) => page.find('.dot-field__hint');
const getOptions = (page: E2EPage) => page.findAll('option');
const getError = (page: E2EPage) => page.find('.dot-field__error-message');

describe('dot-select', () => {
    let page: E2EPage;
    let element: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    describe('render CSS classes', () => {
        beforeEach(async () => {
            page = await newE2EPage();
        });

        describe('with data', () => {
            it('should be invalid, touched & dirty when no option set', async () => {
                await page.setContent(`
                <dot-select
                    name="testName"
                    label="testLabel"
                    hint="testHint"
                    options="|,valueA|1,valueB|2"
                    value="2"
                    required-message="testErrorMsg"
                    required="true">
                </dot-select>`);
                element = await page.find('dot-select');
                await page.select('select', '');
                await page.waitForChanges();
                expect(element).toHaveClasses(['dot-invalid', 'dot-touched', 'dot-dirty']);
            });
        });

        describe('without data', () => {
            it('should be pristine, untouched & valid', async () => {
                await page.setContent(`<dot-select></dot-select>`);
                element = await page.find('dot-select');
                expect(element).toHaveClasses([
                    'dot-pristine',
                    'dot-untouched',
                    'dot-valid',
                    'hydrated'
                ]);
            });
        });
    });

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-select></dot-select>`);
            element = await page.find('dot-select');
        });

        describe('disabled', () => {
            it('should not render attribute', async () => {
                const htmlElement = await getSelect(page);
                expect(await htmlElement.getAttribute('disabled')).toBe(null);
            });

            it('should render attribute', async () => {
                element.setProperty('disabled', true);
                await page.waitForChanges();
                const htmlElement = await getSelect(page);
                expect(await htmlElement.getAttribute('disabled')).toBe('');
            });

            it('should not break with invalid data', async () => {
                element.setProperty('disabled', ['a', 'b']);
                await page.waitForChanges();
                const htmlElement = await getSelect(page);
                expect(await htmlElement.getAttribute('disabled')).toBe('');
            });
        });

        describe('name', () => {
            const value = 'test';

            it('should render attribute in label and select', async () => {
                element.setProperty('name', value);
                await page.waitForChanges();

                const selectElement = await getSelect(page);
                const idValue = await selectElement.getProperty('id');
                expect(idValue.indexOf(value)).toBeGreaterThan(-1);

                const labelElement = await getDotLabel(page);
                expect(await labelElement.getProperty('name')).toBe(value);
            });

            it('should not render attribute in label and select', async () => {
                const selectElement = await getSelect(page);
                const idValue = await selectElement.getProperty('id');
                expect(idValue.indexOf(value)).toBe(-1);

                const labelElement = await getDotLabel(page);
                expect(await labelElement.getProperty('name')).toBe('');
            });

            it('should not break with invalid data', async () => {
                const wrongValue = { a: 1 };
                element.setProperty('name', wrongValue);
                await page.waitForChanges();

                const selectElement = await getSelect(page);
                const idValue = await selectElement.getProperty('id');
                expect(idValue.indexOf(wrongValue)).toBe(-1);
            });
        });

        describe('label', () => {
            it('should render attribute in label', async () => {
                const value = 'test';
                element.setProperty('label', value);
                await page.waitForChanges();

                const labelElement = await getDotLabel(page);
                expect(await labelElement.getProperty('label')).toBe(value);
            });

            it('should not break with invalid data', async () => {
                const wrongValue = { a: 1 };
                element.setProperty('label', wrongValue);
                await page.waitForChanges();

                const labelElement = await getDotLabel(page);
                expect(labelElement).toBeTruthy();
            });
        });

        describe('hint', () => {
            it('should render hint', async () => {
                const value = 'test';
                element.setProperty('hint', value);
                await page.waitForChanges();

                const hintElement = await getHint(page);
                expect(hintElement.innerHTML).toBe(value);
            });

            it('should not render hint', async () => {
                const hintElement = await getHint(page);
                expect(hintElement).toBeNull();
            });

            it('should not break with invalid data', async () => {
                const wrongValue = [{ a: 1 }];
                element.setProperty('hint', wrongValue);
                await page.waitForChanges();

                const hintElement = await getHint(page);
                expect(hintElement.innerHTML).toBe('<undefined></undefined>');
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
                expect(optionElements).toEqual([]);
            });

            it('should not break with invalid data', async () => {
                const wrongValue = [{ a: 1 }];
                element.setProperty('options', wrongValue);
                await page.waitForChanges();

                const optionElements = await getOptions(page);
                expect(optionElements).toEqual([]);
            });
        });

        describe('required & requiredMessage', () => {
            it('should render required attribute in label', async () => {
                element.setProperty('required', true);
                await page.waitForChanges();
                const labelElement = await getDotLabel(page);
                expect(await labelElement.getProperty('required')).toBe(true);
            });

            it('should render required error msg', async () => {
                element.setProperty('required', true);
                element.setProperty('requiredMessage', 'test');
                await page.waitForChanges();
                const errorElement = await getError(page);
                expect(errorElement.innerHTML).toBe('test');
            });

            it('should not render required error msg', async () => {
                const errorElement = await getError(page);
                expect(errorElement).toBe(null);
            });

            it('should not break with invalid data', async () => {
                const wrongValue = [{ a: 1 }];
                element.setProperty('required', wrongValue);
                element.setProperty('requiredMessage', wrongValue);

                await page.waitForChanges();

                const errorElement = await getError(page);
                expect(errorElement).toBeTruthy();
                expect(errorElement.innerHTML).toBe('<undefined></undefined>');
            });
        });

        describe('value', () => {
            it('should render option as selected', async () => {
                element.setProperty('options', 'a|1,b|2');
                element.setProperty('value', '2');
                await page.waitForChanges();

                const optionElements = await getOptions(page);
                expect(await optionElements[1].getProperty('selected')).toBe(true);
            });

            it('should render no selected option', async () => {
                element.setProperty('options', 'a|1,b|2,c|3');
                await page.waitForChanges();

                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('selected')).toBe(true);
                expect(await optionElements[1].getProperty('selected')).toBe(false);
            });

            it('should not break with invalid data', async () => {
                const wrongValue = [{ a: 1 }];
                element.setProperty('options', 'a|1,b|2,c|3');
                element.setProperty('value', wrongValue);
                await page.waitForChanges();

                const optionElements = await getOptions(page);
                expect(await optionElements[0].getProperty('selected')).toBe(true);
                expect(await optionElements[1].getProperty('selected')).toBe(false);
            });
        });
    });

    describe('@Events', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`
            <dot-select
                name="testName"
                label="testLabel"
                hint="testHint"
                options="|,valueA|1,valueB|2"
                value="2"
                required-message="testErrorMsg"
                required="true">
            </dot-select>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-select');
        });

        describe('status and value change', () => {
            it('should emit when option selected', async () => {
                await page.select('select', '1');
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

            it('should emit on Reset', async () => {
                await element.callMethod('reset');
                expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                    name: 'testName',
                    status: {
                        dotPristine: true,
                        dotTouched: false,
                        dotValid: false
                    }
                });
                expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                    name: 'testName',
                    value: ''
                });
            });
        });
    });
});
