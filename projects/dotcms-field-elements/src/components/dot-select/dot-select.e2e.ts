import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-select', () => {

    let page: E2EPage;
    let element: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChangeEvent: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage();

        await page.setContent(`
        <dot-select
            name="testName"
            label="testLabel"
            hint="testHint"
            options="|,valueA|1,valueB|2"
            value="2"
            requiredmessage="testErrorMsg"
            required
            >
        </dot-select>`);
        element = await page.find('dot-select');
        spyStatusChangeEvent = await page.spyOnEvent('statusChange');
        spyValueChangeEvent = await page.spyOnEvent('valueChange');
    });

    it('renders', async () => {
        // tslint:disable-next-line:max-line-length
        const expectedMarkup = `<dot-select name=\"testName\" label=\"testLabel\" hint=\"testHint\" options=\"|,valueA|1,valueB|2\" value=\"2\" requiredmessage=\"testErrorMsg\" required=\"\" class=\"dot-valid dot-pristine dot-untouched hydrated\"><label for=\"testName\">testLabel</label><select id=\"testName\"><option value=\"\"></option><option value=\"1\">valueA</option><option value=\"2\">valueB</option></select><span class=\"dot-field__hint\">testHint</span></dot-select>`;
        const hint = await element.find('.dot-field__hint');
        expect(element.outerHTML).toBe(expectedMarkup);
        expect(hint).toBeTruthy();
    });

    it('it should not render hint', async () => {
        element.setProperty('hint', '');
        await page.waitForChanges();
        const hint = await element.find('.dot-field__hint');
        expect(hint).toBeNull();
    });

    it('should emit "statusChange" & "valueChange"', async () => {
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

    it('should be invalid, touched & dirty and the error msg should display', async () => {
        await page.select('select', '');
        await page.waitForChanges();
        // tslint:disable-next-line:max-line-length
        expect(element.outerHTML).toBe(`<dot-select name=\"testName\" label=\"testLabel\" hint=\"testHint\" options=\"|,valueA|1,valueB|2\" value=\"2\" requiredmessage=\"testErrorMsg\" required=\"\" class=\"hydrated dot-invalid dot-dirty dot-touched\"><label for=\"testName\">testLabel</label><select id=\"testName\"><option value=\"\"></option><option value=\"1\">valueA</option><option value=\"2\">valueB</option></select><span class=\"dot-field__hint\">testHint</span>&lt;span class='dot-field__error-message'&gt;testErrorMsg&lt;/span&gt;</dot-select>`);
    });

    it('should emit status and value on Reset', async () => {
        element.callMethod('reset');
        await page.waitForChanges();
        expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
            name: 'testName',
            status: {
                dotPristine: true,
                dotTouched: false,
                dotValid: false
            }
        });
        expect(spyValueChangeEvent).toHaveReceivedEventDetail({ name: 'testName', value: '' });
    });
});
