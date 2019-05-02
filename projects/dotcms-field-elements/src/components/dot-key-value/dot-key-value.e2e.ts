import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
// import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-key-value', () => {
    let page: E2EPage;
    let element: E2EElement;
    // let spyStatusChangeEvent: EventSpy;
    // let spyValueChangeEvent: EventSpy;

    describe('With data', () => {
        beforeEach(async () => {
            page = await newE2EPage();

            await page.setContent(`
            <dot-key-value
                name="testName"
                label="testLabel"
                field-type="Key-Value"
                hint="testHint"
                key-placeholder="Enter Key"
                value-placeholder="Enter Value"
                value="valueA|1,valueB|2"
                required-message="testErrorMsg"
                required="true"
                save-btn-label="Save"
                >
            </dot-key-value>`);
            element = await page.find('dot-key-value');
        });

        it('renders', async () => {
            // tslint:disable-next-line:max-line-length
            const expectedMarkup = `<dot-key-value name=\"testName\" label=\"testLabel\" field-type=\"Key-Value\" hint=\"testHint\" key-placeholder=\"Enter Key\" value-placeholder=\"Enter Value\" value=\"valueA|1,valueB|2\" required-message=\"testErrorMsg\" required=\"true\" save-btn-label=\"Save\" class=\"dot-valid dot-pristine dot-untouched dot-required hydrated\"><div class=\"dot-field__label\"><label for=\"testName\">testLabel</label><span class=\"dot-field__required-mark\">*</span></div><input id=\"testName\" name=\"key\" placeholder=\"Enter Key\" type=\"text\"><input name=\"value\" placeholder=\"Enter Value\" type=\"text\"><button type=\"button\">Save</button><key-value-table class=\"hydrated\"><table><tbody><tr><td><button type=\"button\" id=\"valueA_1_0\" class=\"dot-key-value__delete__button\"><label for=\"valueA_1_0\">Delete</label></button></td><td>valueA</td><td>1</td></tr><tr><td><button type=\"button\" id=\"valueB_2_1\" class=\"dot-key-value__delete__button\"><label for=\"valueB_2_1\">Delete</label></button></td><td>valueB</td><td>2</td></tr></tbody></table></key-value-table><span class=\"dot-field__hint\">testHint</span></dot-key-value>`;
            const hint = await element.find('.dot-field__hint');
            const table = await element.find('table');
            expect(element.outerHTML).toBe(expectedMarkup);
            expect(hint).toBeTruthy();
            expect(table).toBeTruthy();
            expect(element.classList.contains('dot-valid')).toBe(true);
            expect(element.classList.contains('dot-pristine')).toBe(true);
            expect(element.classList.contains('dot-untouched')).toBe(true);
            expect(element.classList.contains('dot-required')).toBe(true);
        });

        it('should not render hint', async () => {
            element.setProperty('hint', '');
            await page.waitForChanges();
            const hint = await element.find('.dot-field__hint');
            expect(hint).toBeNull();
        });

        it('should have required as false', async () => {
            element.setProperty('required', 'false');
            await page.waitForChanges();
            const required = await element.getProperty('required');
            expect(required).toBeFalsy();
        });

        // it('should be invalid, touched & dirty and the error msg should display', async () => {
        //     await page.select('select', '');
        //     await page.waitForChanges();
        //     // tslint:disable-next-line:max-line-length
        //     expect(element.outerHTML).toBe(`<dot-multi-select name=\"testName\" label=\"testLabel\" hint=\"testHint\" options=\"|,valueA|1,valueB|2\" value=\"2\" required-message=\"testErrorMsg\" required=\"true\" size=\"3\" class=\"dot-required hydrated dot-invalid dot-dirty dot-touched\"><div class=\"dot-field__label\"><label for=\"testName\">testLabel</label><span class=\"dot-field__required-mark\">*</span></div><select multiple=\"\" size=\"3\" class=\"dot-field__error\" id=\"testName\"><option value=\"\"></option><option value=\"1\">valueA</option><option value=\"2\">valueB</option></select><span class=\"dot-field__hint\">testHint</span><span class=\"dot-field__error-meessage\">testErrorMsg</span></dot-multi-select>`);
        // });

        // describe('Events', () => {
        //     beforeEach(async () => {
        //         spyStatusChangeEvent = await page.spyOnEvent('statusChange');
        //         spyValueChangeEvent = await page.spyOnEvent('valueChange');
        //     });

        //     it('should emit "statusChange" & "valueChange"', async () => {
        //         await page.select('select', '1', '2');
        //         expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
        //             name: 'testName',
        //             status: {
        //                 dotPristine: false,
        //                 dotTouched: true,
        //                 dotValid: true
        //             }
        //         });
        //         expect(spyValueChangeEvent).toHaveReceivedEventDetail({
        //             name: 'testName',
        //             value: '1,2'
        //         });
        //     });

        //     it('should emit status and value on Reset', async () => {
        //         element.callMethod('reset');
        //         await page.waitForChanges();
        //         expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
        //             name: 'testName',
        //             status: {
        //                 dotPristine: true,
        //                 dotTouched: false,
        //                 dotValid: false
        //             }
        //         });
        //         expect(spyValueChangeEvent).toHaveReceivedEventDetail({ name: 'testName', value: '' });
        //     });
        // });
    });

    describe('Without data', () => {
        beforeEach(async () => {
            page = await newE2EPage();

            await page.setContent(`
            <dot-key-value
                name="testName"
                label="testLabel"
                fieldType="Key-Value"
                hint="testHint"
                keyPlaceholder="Enter Key"
                valuePlaceholder="Enter Value"
                required-message="testErrorMsg"
                required="true"
                saveBtnLabel="Save"
                >
            </dot-key-value>`);
            element = await page.find('dot-key-value');
        });

        it('should not render table and be Invalid', async () => {
            const table = await element.find('table');
            expect(element.classList.contains('dot-invalid')).toBe(true);
            expect(element.classList.contains('dot-pristine')).toBe(true);
            expect(element.classList.contains('dot-untouched')).toBe(true);
            expect(element.classList.contains('dot-required')).toBe(true);
            expect(table).toBeNull();
        });
    });
});
