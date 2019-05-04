import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-input-calendar', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChange: EventSpy;
    let spyUpdateClassEvt: EventSpy;
    let spyShowErrorMessageEvt: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `
              <dot-input-calendar
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
                    type="time"
                ></dot-input-calendar>`
        });

        spyValueChange = await page.spyOnEvent('_valueChange');
        spyStatusChangeEvent = await page.spyOnEvent('_statusChange');
        spyUpdateClassEvt = await page.spyOnEvent('_updateClassEvt');
        spyShowErrorMessageEvt = await page.spyOnEvent('_showErrorMessageEvt');
        element = await page.find('dot-input-calendar');
        input = await page.find('input');
    });

    it('should render', () => {
        // tslint:disable-next-line:max-line-length
        const tagsRenderExpected = `<input id=\"time01\" required=\"\" type=\"time\" min=\"06:00:00\" max=\"22:00:00\" step=\"10\">`;
        expect(element.innerHTML).toBe(tagsRenderExpected);
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

        it('should emit error tag when value is not in valid range', async () => {
            await input.press('0');
            await page.waitForChanges();
            expect(spyShowErrorMessageEvt).toHaveReceivedEventDetail({
                show: true,
                message: 'Time out of range'
            });
        });

        it('should emit status and value errorElement and class events on Reset', async () => {
            element.callMethod('reset');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'time01',
                status: {
                    dotPristine: true,
                    dotTouched: false,
                    dotValid: false
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({ name: 'time01', value: '' });
            expect(spyShowErrorMessageEvt).toHaveReceivedEventDetail({
                message: 'Time out of range',
                show: false
            });
            expect(spyUpdateClassEvt).toHaveReceivedEventDetail({
                'dot-dirty': false,
                'dot-invalid': true,
                'dot-pristine': true,
                'dot-required': true,
                'dot-touched': false,
                'dot-untouched': true,
                'dot-valid': false
            });
        });

        it('should emit status, value, errorElement and class events on changes', async () => {
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
            expect(spyShowErrorMessageEvt).toHaveReceivedEventDetail({
                show: false,
                message: ''
            });
            expect(spyUpdateClassEvt).toHaveReceivedEventDetail({
                'dot-dirty': true,
                'dot-invalid': false,
                'dot-pristine': false,
                'dot-required': true,
                'dot-touched': true,
                'dot-untouched': false,
                'dot-valid': true
            });
        });
    });
});
