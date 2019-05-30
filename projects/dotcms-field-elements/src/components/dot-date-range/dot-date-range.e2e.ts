import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import { dotTestUtil } from '../../utils';

const getDays = (page: E2EPage) => page.findAll('.flatpickr-day');

describe('dot-date-range', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    describe('render', () => {
        beforeEach(async () => {
            page = await newE2EPage();
        });

        describe('CSS classes', () => {
            it('should be valid, touched & dirty when picked an option', async () => {
                await page.setContent(`<dot-date-range name='dateRange'></dot-date-range>`);
                input = await page.find('input');
                await input.click();
                const days = await getDays(page);
                days[5].click();
                days[8].click();
                await page.waitForChanges();
                element = await page.find('dot-date-range');
                expect(element).toHaveClasses(dotTestUtil.class.filled);
            });

            it('should be valid, touched, dirty & required when picked an option', async () => {
                await page.setContent(`<dot-date-range name='dateRange' required="true"></dot-date-range>`);
                input = await page.find('input');
                await input.click();
                const days = await getDays(page);
                days[5].click();
                days[8].click();
                await page.waitForChanges();
                element = await page.find('dot-date-range');
                expect(element).toHaveClasses(dotTestUtil.class.filledRequired);
            });

            it('should be invalid, untouched, pristine & required when no option set on load', async () => {
                await page.setContent(`<dot-date-range name='dateRange' required="true"></dot-date-range>`);
                element = await page.find('dot-date-range');
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.emptyRequiredPristine);
            });

            it('should be pristine, untouched & valid when loaded with no options', async () => {
                await page.setContent(`<dot-date-range name='dateRange'></dot-date-range>`);
                element = await page.find('dot-date-range');
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });
        });
    });

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-date-range></dot-date-range>`);
            element = await page.find('dot-date-range');
            input = await page.find('input');
        });

        describe('disabled', () => {
            it('should render attribute', async () => {
                element.setProperty('disabled', true);
                await page.waitForChanges();
                expect(input.getAttribute('disabled')).toBeDefined();
            });

            it('should not set attribute', async () => {
                expect(input.getAttribute('disabled')).toBeNull();
            });
        });

        describe('name', () => {
            const value = 'test';

            it('should render attribute in label and select', async () => {
                element.setProperty('name', value);
                await page.waitForChanges();
                const idValue = input.getAttribute('id');
                expect(idValue).toBe('dot-test');
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('name')).toBe(value);
            });

            it('should not render attribute in label and select', async () => {
                const idValue = input.getAttribute('id');
                expect(idValue).toBe('dot-daterange');
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('name')).toBe('daterange');
            });

            it('should not break with invalid data', async () => {
                const wrongValue = [1, 2, '3'];
                element.setProperty('name', wrongValue);
                await page.waitForChanges();
                const idValue = input.getAttribute('id');
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

            it('should not set attribute', async () => {
                const labelElement = await dotTestUtil.getDotLabel(page);
                expect(labelElement.getAttribute('label')).toBe('');
            });
        });

        describe('presetLabel', () => {
            it('should render attribute in preset label', async () => {
                const value = 'test';
                element.setProperty('presetLabel', value);
                await page.waitForChanges();
                const presetLabel = await page.find('label:not(.dot-label)');
                expect(presetLabel.innerText.indexOf(value)).not.toBe(-1);
            });

            it('should render default value in preset label', async () => {
                const presetLabel = await page.find('label:not(.dot-label)');
                expect(presetLabel.innerText.indexOf('Presets')).not.toBe(-1);
            });
        });

        describe('presets', () => {
            it('should render attribute with preset set', async () => {
                const value = [{ label: 'Last Week', days: -7 }];
                element.setProperty('presets', value);
                await page.waitForChanges();
                const getOptions = await page.findAll('option');
                expect(getOptions.length).toBe(1);
            });

            it('should render default value in presets', async () => {
                const getOptions = await page.findAll('option');
                expect(getOptions.length).toBe(5);

            });

            it('should not break with invalid data and load default values', async () => {
                const wrongValue = '3';
                element.setProperty('presets', wrongValue);
                await page.waitForChanges();
                const getOptions = await page.findAll('option');
                expect(getOptions.length).toBe(5);
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
        });

        describe('required', () => {
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
            it('should render with default value', async () => {
                element.setProperty('value', '2019-11-25,2019-11-27');
                await page.waitForChanges();
                expect(await input.getProperty('value')).toBe('2019-11-25,2019-11-27');
            });

            it('should render options with no data', async () => {
                expect(await input.getProperty('value')).toBe('');
            });

            it('should not break with wrong data format', async () => {
                element.setProperty('value', 'a1,2,c|3');
                await page.waitForChanges();
                expect(await input.getProperty('value')).toBe('');
            });

            it('should not break with wrong data type', async () => {
                element.setProperty('value', [{ a: 1 }]);
                await page.waitForChanges();
                expect(await input.getProperty('value')).toBe('');
            });
        });
    });

    describe('@Events', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`
            <dot-date-range
                name="testName"
                value="2019-11-25,2019-11-27">
            </dot-date-range>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-date-range');
        });

        describe('status and value change', () => {
            it('should emit when option selected', async () => {
                input = await page.find('input');
                await input.click();
                const days = await getDays(page);
                days[5].click();
                days[8].click();
                await page.waitForChanges();
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
                    value: '2019-11-01,2019-11-04'
                });
            });
        });

        it('should emit when preset selected', async () => {
            const dt = new Date();
            dt.setDate(dt.getDate() + 7);
            const expectedDate = `${new Date().toISOString().split('T')[0]},${dt.toISOString().split('T')[0]}`;
            await page.select('select', '7');
            await page.waitForChanges();
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
                value: expectedDate
            });
        });
    });

    describe('@Methods', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-date-range name="testName"></dot-date-range>`);
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-date-range');
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
        });
    });
});
