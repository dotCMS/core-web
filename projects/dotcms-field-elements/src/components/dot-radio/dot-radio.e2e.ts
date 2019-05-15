import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-radio', () => {
    let page: E2EPage;
    let element: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage();

        await page.setContent(`
        <dot-radio
            name="testRadio"
            label="testLabel"
            hint="testHint"
            options="valueA|1,valueB|2,valueC|3"
            value="2"
            required="true"
            required-message="testErrorMsg"
            >
        </dot-radio>`);
        element = await page.find('dot-radio');
    });

    it('renders', async () => {
        // tslint:disable-next-line:max-line-length
        const expectedMarkup = `<dot-radio name=\"testRadio\" label=\"testLabel\" hint=\"testHint\" options=\"valueA|1,valueB|2,valueC|3\" value=\"2\" required=\"true\" required-message=\"testErrorMsg\" class=\"dot-valid dot-pristine dot-untouched dot-required hydrated\"><div class=\"dot-field__label\"><label for=\"dot-testRadio\" id=\"label-testRadio\">testLabel</label><span class=\"dot-field__required-mark\">*</span></div><div tabindex=\"0\" class=\"dot-radio__items\" role=\"radiogroup\" aria-labelledby=\"label-testRadio\" aria-describedby=\"hint-testRadio\"><label><input name=\"testradio\" type=\"radio\" value=\"1\">valueA</label><label><input name=\"testradio\" type=\"radio\" value=\"2\">valueB</label><label><input name=\"testradio\" type=\"radio\" value=\"3\">valueC</label></div><span class=\"dot-field__hint\" id=\"hint-testRadio\">testHint</span></dot-radio>`;
        expect(element.outerHTML).toBe(expectedMarkup);
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

    it('should be valid, touched & dirty ', async () => {
        await page.click('input');
        await page.waitForChanges();
        expect(element.classList.contains('dot-valid')).toBe(true);
        expect(element.classList.contains('dot-dirty')).toBe(true);
        expect(element.classList.contains('dot-touched')).toBe(true);
    });

    describe('Events', () => {
        beforeEach(async () => {
            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChangeEvent = await page.spyOnEvent('valueChange');
        });

        it('should emit "statusChange" & "valueChange"', async () => {
            await page.click('input');
            await page.waitForChanges();

            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'testRadio',
                status: {
                    dotPristine: false,
                    dotTouched: true,
                    dotValid: true
                }
            });
            expect(spyValueChangeEvent).toHaveReceivedEventDetail({
                name: 'testRadio',
                value: '1'
            });
        });

        it('should emit status and value on Reset', async () => {
            element.callMethod('reset');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'testRadio',
                status: {
                    dotPristine: true,
                    dotTouched: false,
                    dotValid: false
                }
            });
            expect(spyValueChangeEvent).toHaveReceivedEventDetail({ name: 'testRadio', value: '' });
        });
    });
});
