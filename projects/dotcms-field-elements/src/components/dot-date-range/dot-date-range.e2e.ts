import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-date-range', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChange: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `
              <dot-date-range
                    label='Name:'
                    min="2019-01-01"
                    max="2019-12-31"
                    name='dateRange'
                    value='2019-05-01,2019-05-08'
                    hint='this is a hint'
                    required=true
                    required-message="Required Name"
                ></dot-date-range>`
        });

        spyStatusChangeEvent = await page.spyOnEvent('statusChange');
        spyValueChange = await page.spyOnEvent('valueChange');
        element = await page.find('dot-date-range');
        input = await page.find('input');
    });

    it('should render', async() => {
        // tslint:disable-next-line:max-line-length
        const tagsRenderExpected = `<dot-date-range label=\"Name:\" min=\"2019-01-01\" max=\"2019-12-31\" name=\"dateRange\" value=\"2019-05-01,2019-05-08\" hint=\"this is a hint\" required=\"true\" required-message=\"Required Name\" class=\"dot-valid dot-pristine dot-untouched dot-required hydrated\"><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css\"><div class=\"dot-field__label\"><label for=\"dateRange\">Name:</label><span class=\"dot-field__required-mark\">*</span></div><input class=\"flatpickr-input\" id=\"dateRange\" required=\"\" type=\"text\" readonly=\"readonly\"><select><option value=\"0\">Date Presets</option><option value=\"-7\">Last Week</option><option value=\"7\">Next Week</option><option value=\"-30\">Last Month</option><option value=\"30\">Next Month</option></select><span class=\"dot-field__hint\">this is a hint</span></dot-date-range>`;
        const dateValue = await input.getProperty('value');
        expect(element.outerHTML).toBe(tagsRenderExpected);
        expect(dateValue).toBe('2019-05-01 to 2019-05-08');
        expect(element.classList.contains('dot-valid')).toBe(true);
        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
    });

    it('should be invalid', async() => {
        element.setProperty('value', '');
        await page.waitForChanges();
        expect(element.classList.contains('dot-invalid')).toBe(true);
        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
    });

    it('it should not render hint', async () => {
        element.setProperty('hint', '');
        await page.waitForChanges();
        const hint = await element.find('.dot-field__hint');
        expect(hint).toBeNull();
    });

    it('should open flatpickr when click on input and select date range', async() => {
        input.click();
        await page.waitForChanges();
        const calendar = await page.find('.flatpickr-calendar');
        expect(calendar.classList.contains('open')).toBeTruthy();
        const days = await page.findAll('.flatpickr-day');
        days[5].click();
        days[8].click();
        await page.waitForChanges();
        const dateValue = await input.getProperty('value');
        expect(dateValue).toBe('2019-05-03,2019-05-06');
        expect(element.classList.contains('dot-valid')).toBe(true);
        expect(element.classList.contains('dot-dirty')).toBe(true);
        expect(element.classList.contains('dot-touched')).toBe(true);
        expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
            name: 'dateRange',
            status: {
                dotPristine: false,
                dotTouched: true,
                dotValid: true
            }
        });
        expect(spyValueChange).toHaveReceivedEventDetail({
            name: 'dateRange',
            value: '2019-05-03,2019-05-06'
        });
    });

    it('should set date based on preset', async() => {
        const preset = 7;
        await page.select('select', preset.toString());
        await page.waitForChanges();

        const dt = new Date();
        const today = dt.toISOString().split('T')[0];
        dt.setDate(dt.getDate() + preset);
        const future = dt.toISOString().split('T')[0];

        const dateValue = await input.getProperty('value');
        expect(dateValue).toBe(`${today},${future}`);
    });

    it('should clear value, set pristine and untouched  when input set reset', async () => {
        element.callMethod('reset');
        await page.waitForChanges();

        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
        expect(element.classList.contains('dot-invalid')).toBe(true);
        expect(await input.getProperty('value')).toBe('');
    });

});
