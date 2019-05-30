import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';
import {dotTestUtil} from '../../utils';


describe('dot-time', () => {
    let page: E2EPage;
    let element: E2EElement;
    let inputCalendar: E2EElement;

    describe('render CSS classes', () => {
        beforeEach(async () => {
            page = await newE2EPage();
        });

        describe('with data', () => {
            beforeEach(async () => {
                await page.setContent(`<dot-time value='10:10:00' ></dot-time>`);
                element = await page.find('dot-time');
                inputCalendar = await page.find('input');
            });

            it('should be valid, untouched & pristine on load', async () => {
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });

            it('should be valid, touched & dirty when filled', async () => {
                await inputCalendar.press('1');
                await page.waitForChanges();
                expect(element).toHaveClasses(dotTestUtil.class.filled);
            });

            describe('required', () => {
                beforeEach(async () => {
                    element.setProperty('required', 'true');
                });

                it('should be valid, untouched & pristine and required when filled on load', async () => {
                    await page.waitForChanges();
                    expect(element).toHaveClasses(dotTestUtil.class.filledRequiredPristine);
                });

                it('should be valid, touched & dirty and required when filled', async () => {
                    await inputCalendar.press('1');
                    await page.waitForChanges();
                    expect(element).toHaveClasses(dotTestUtil.class.filledRequired);
                });

                it('should be invalid, untouched, pristine and required when empty on load', async () => {
                    element.setProperty('value', '');
                    await page.waitForChanges();
                    expect(element).toHaveClasses(dotTestUtil.class.emptyRequiredPristine);
                });

                it('should be invalid, touched, dirty and required when valued is cleared', async () => {
                    await inputCalendar.press('Backspace');
                    await page.waitForChanges();
                    expect(element).toHaveClasses(dotTestUtil.class.emptyRequired);
                });
            });
        });

        describe('without data', () => {
            it('should be pristine, untouched & valid', async () => {
                await page.setContent(`<dot-time></dot-time>`);
                element = await page.find('dot-time');
                expect(element).toHaveClasses(dotTestUtil.class.empty);
            });
        });
    });

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage({
                html: `<dot-textarea></dot-textarea>`
            });
            element = await page.find('dot-textarea');
            textarea = await page.find('textarea');
        });

        describe('value', () => {
            it('should set value correctly', async () => {
                element.setProperty('value', 'text');
                await page.waitForChanges();
                expect(await textarea.getProperty('value')).toBe('text');
            });
            it('should render and not break when is a unexpected value', async () => {
                element.setProperty('value', { test: true });
                await page.waitForChanges();
                expect(await textarea.getProperty('value')).toBe('[object Object]');
            });
        });

        describe('name', () => {
            it('should render with valid id name', async () => {
                element.setProperty('name', 'text01');
                await page.waitForChanges();
                expect(textarea.getAttribute('id')).toBe('dot-text01');
            });

            it('should render when is a unexpected value', async () => {
                element.setProperty('name', { input: 'text01' });
                await page.waitForChanges();
                expect(textarea.getAttribute('id')).toBe('dot-object-object');
            });

            it('should set name prop in dot-label', async () => {
                element.setProperty('name', 'text01');
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(label.getAttribute('name')).toBe('text01');
            });
        });

        describe('label', () => {
            it('should set label prop in dot-label', async () => {
                element.setProperty('label', 'test');
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(label.getAttribute('label')).toBe('test');
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

            it('should not break hint with invalid hint value', async () => {
                element.setProperty('hint', { test: 'hint' });
                await page.waitForChanges();
                expect((await dotTestUtil.getHint(page)).innerText).toBe('[object Object]');
            });
        });

        describe('required', () => {
            it('should render required attribute with invalid value', async () => {
                element.setProperty('required', { test: 'test' });
                await page.waitForChanges();
                expect(textarea.getAttribute('required')).toBeDefined();
            });

            it('should not render required attribute', async () => {
                element.setProperty('required', 'false');
                await page.waitForChanges();
                expect(textarea.getAttribute('required')).toBeNull();
            });

            it('should render required attribute for the dot-label', async () => {
                element.setProperty('required', 'true');
                await page.waitForChanges();
                const label = await dotTestUtil.getDotLabel(page);
                expect(label.getAttribute('label')).toBeDefined();
            });
        });

        describe('requiredMessage', () => {
            it('should show default value of requiredMessage', async () => {
                element.setProperty('required', 'true');
                await textarea.press('a');
                await textarea.press('Backspace');
                await page.waitForChanges();
                expect((await dotTestUtil.getErrorMessage(page)).innerText).toBe(
                    'This field is required'
                );
            });

            it('should show requiredMessage', async () => {
                element.setProperty('required', 'true');
                element.setProperty('requiredMessage', 'Test');
                await textarea.press('a');
                await textarea.press('Backspace');
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
                await textarea.press('a');
                await textarea.press('Backspace');
                await page.waitForChanges();
                expect((await dotTestUtil.getErrorMessage(page)).innerText).toBe('[object Object]');
            });
        });

        describe('regexCheck', () => {
            it('should set correct value when valid regexCheck', async () => {
                element.setAttribute('regex-check', '[0-9]*');
                await page.waitForChanges();
                expect(await element.getProperty('regexCheck')).toBe('[0-9]*');
            });

            it('should set empty value when invalid regexCheck', async () => {
                element.setAttribute('regex-check', '[*');
                await page.waitForChanges();
                expect(await element.getProperty('regexCheck')).toBe('');
            });
        });

        describe('validationMessage', () => {
            it('should show default value of validationMessage', async () => {
                element.setProperty('regexCheck', '[0-9]');
                await textarea.press('a');
                await page.waitForChanges();
                expect((await dotTestUtil.getErrorMessage(page)).innerText).toBe(
                    "The field doesn't comply with the specified format"
                );
            });

            it('should render validationMessage', async () => {
                element.setProperty('regexCheck', '[0-9]');
                element.setProperty('validationMessage', 'Test');
                await textarea.press('a');
                await page.waitForChanges();
                expect((await dotTestUtil.getErrorMessage(page)).innerText).toBe('Test');
            });

            it('should not render validationMessage whe value is valid', async () => {
                await textarea.press('a');
                await page.waitForChanges();
                expect(await dotTestUtil.getErrorMessage(page)).toBeNull();
            });
        });

        describe('disabled', () => {
            it('should render disabled attribute', async () => {
                element.setProperty('disabled', 'true');
                await page.waitForChanges();
                expect(textarea.getAttribute('disabled')).toBeDefined();
            });

            it('should not render disabled attribute', async () => {
                element.setProperty('disabled', 'false');
                await page.waitForChanges();
                expect(textarea.getAttribute('disabled')).toBeNull();
            });

            it('should render disabled attribute with invalid value', async () => {
                element.setProperty('disabled', { test: 'test' });
                await page.waitForChanges();
                expect(textarea.getAttribute('disabled')).toBeDefined();
            });
        });
    });

    describe('@Events', () => {
        let spyStatusChangeEvent: EventSpy;
        let spyValueChangeEvent: EventSpy;

        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-textarea></dot-textarea>`);

            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');

            element = await page.find('dot-textarea');
            textarea = await page.find('textarea');
        });

        describe('status and value change', () => {
            it('should send status and value change', async () => {
                await textarea.press('a');
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
                await textarea.triggerEvent('blur');
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


/*describe('dot-time', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChange: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `
              <dot-time
                    label="Time:"
                    name="time01"
                    value="18:30:30"
                    hint="Time hint"
                    required
                    required-message="Required Time"
                    validation-message="Time out of range"
                    min="06:00:00"
                    max="22:00:00"
                    step="10"
                ></dot-time>`
        });

        spyStatusChangeEvent = await page.spyOnEvent('statusChange');
        spyValueChange = await page.spyOnEvent('valueChange');
        element = await page.find('dot-time');
        input = await page.find('input');
    });

    it('should render', () => {
        // tslint:disable-next-line:max-line-length
        const tagsRenderExpected = `<dot-time label=\"Time:\" name=\"time01\" value=\"18:30:30\" hint=\"Time hint\" required=\"\" required-message=\"Required Time\" validation-message=\"Time out of range\" min=\"06:00:00\" max=\"22:00:00\" step=\"10\" class=\"dot-valid dot-pristine dot-untouched dot-required hydrated\"><div class=\"dot-field__label\"><label for=\"dot-time01\">Time:</label><span class=\"dot-field__required-mark\">*</span></div><dot-input-calendar type=\"time\" required-message=\"Required Time\" validation-message=\"Time out of range\" class=\"hydrated\"><input id=\"dot-time01\" required=\"\" type=\"time\" min=\"06:00:00\" max=\"22:00:00\" step=\"10\"></dot-input-calendar><span class=\"dot-field__hint\">Time hint</span></dot-time>`;
        expect(element.outerHTML).toBe(tagsRenderExpected);
    });

    it('should be valid, touched and dirty on value change', async () => {
        await input.press('2');
        await page.waitForChanges();
        expect(element.classList.contains('dot-valid')).toBe(true);
        expect(element.classList.contains('dot-dirty')).toBe(true);
        expect(element.classList.contains('dot-touched')).toBe(true);
    });

    it('it should not render hint', async () => {
        element.setProperty('hint', '');
        await page.waitForChanges();
        const hint = await element.find('.dot-field__hint');
        expect(hint).toBeNull();
    });

    it('it should have required as false', async () => {
        element.setProperty('required', 'false');
        await page.waitForChanges();
        const required = await element.getProperty('required');
        expect(required).toBeFalsy();
    });

    it('should show invalid range validation message', async () => {
        element.setProperty('value', '01:00:00');
        await input.press('2');
        await page.waitForChanges();
        const errorMessage = await page.find('.dot-field__error-message');
        expect(errorMessage.innerHTML).toBe('Time out of range');
    });

    it('should set the default value of "min" when is not valid', async () => {
        element.setProperty('min', { test: 'min' });
        await page.waitForChanges();
        expect(await input.getProperty('min')).toBe('');
    });

    it('should set the default value of "max" when is not valid', async () => {
        element.setProperty('max', [1, 6, 7]);
        await page.waitForChanges();
        expect(await input.getProperty('max')).toBe('');
    });

    describe('emit events', () => {
        it('should mark as touched when onblur', async () => {
            await input.triggerEvent('blur');
            await page.waitForChanges();

            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'time01',
                status: {
                    dotPristine: true,
                    dotTouched: true,
                    dotValid: true
                }
            });
        });

        it('should send status and value change and stop dot-input-calendar events', async () => {
            const evt_statusChange = await page.spyOnEvent('_statusChange');
            const evt_valueChange = await page.spyOnEvent('_valueChange');
            await input.press('2');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'time01',
                status: {
                    dotPristine: false,
                    dotTouched: true,
                    dotValid: true
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({
                name: 'time01',
                value: '14:30:30'
            });
            expect(evt_statusChange.events).toEqual([]);
            expect(evt_valueChange.events).toEqual([]);
        });

        it('should emit status and value on Reset', async () => {
            await element.callMethod('reset');
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'time01',
                status: {
                    dotPristine: true,
                    dotTouched: false,
                    dotValid: false
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({ name: 'time01', value: '' });
        });
    });
});*/
