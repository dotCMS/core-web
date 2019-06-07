import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { DotCMSContentTypeField } from './../../models/dot-type-field.model';

xdescribe('dot-form', () => {
    let page: E2EPage;
    let element: E2EElement;
    let formStatus = {};

    const fields: DotCMSContentTypeField[] = [
        {
            fieldType: 'Text',
            name: 'field1',
            required: false,
            variable: 'textfield1'
        },
        {
            fieldType: 'Key-Value',
            name: 'Key Value:',
            required: false,
            variable: 'keyvalue2'
        }
    ];

    describe('@Props', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-form></dot-form>`);
            element = await page.find('dot-form');
            element.setProperty('fields', fields);

            await page.waitForChanges();
        });

        describe('fieldsToShow', () => {

        });
    });

    xdescribe('new', () => {
        let spy;

        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(`<dot-form></dot-form>`);
            element = await page.find('dot-form');
            element.setProperty('fields', fields);
            spy = await element.spyOnEvent('onSubmit');

            await page.waitForChanges();
        });

        it('should', async () => {
            const expectedSubmit = {};
            const saveBtn = await element.find('.form__buttons button[type="submit"]');




            await saveBtn.click();
            await page.waitForChanges();

            expect(spy).toHaveReceivedEventDetail({bew: 'test'});
            // const spy = await page.spyOnEvent('onSubmit');

            // const field = await element.find('dot-key-value');
            // field.triggerEvent('valueChange', {
            //     bubbles: true,
            //     cancelable: false,
            //     detail: {
            //         name: 'keyvalue6',
            //         value: 'key|value,llave|valor'
            //     }
            // });

            // const saveBtn = await element.find('button[type="submit"]');

            // saveBtn.click();
            // await page.waitForChanges();
            // expect(spy).toHaveReceivedEventDetail({});
        });
    });

    xdescribe('old', () => {
        beforeEach(async () => {
            page = await newE2EPage();
            await page.setContent(
                `<dot-form submit-label="Saved" reset-label="Reseted"></dot-form>`
            );
            element = await page.find('dot-form');
            element.setProperty('fields', fields);
            await page.waitForChanges();
            const txtFields = await element.findAll('dot-textfield');
            txtFields.forEach(async (field, index) => {
                await field.triggerEvent('valueChange', {
                    bubbles: true,
                    cancelable: false,
                    detail: {
                        name: fields[index].name,
                        value: fields[index].value
                    }
                });
            });
            await page.waitForChanges();
            formStatus = await element.getProperty('value');
        });
        it('should renders', async () => {
            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<form><dot-textfield class=\"dot-valid dot-pristine dot-untouched dot-required hydrated\"><div class=\"dot-field__label\"><label for=\"dot-field1\">field1</label><span class=\"dot-field__required-mark\">*</span></div><input id=\"dot-field1\" placeholder=\"\" required=\"\" type=\"text\"><span class=\"dot-field__hint\">hint1</span></dot-textfield><dot-textfield class=\"dot-valid dot-pristine dot-untouched hydrated\"><div class=\"dot-field__label\"><label for=\"dot-field2\">field2</label></div><input id=\"dot-field2\" placeholder=\"\" type=\"text\"><span class=\"dot-field__hint\">hint2</span></dot-textfield><div class=\"form__buttons\"><button type=\"button\">Reseted</button><button type=\"submit\">Saved</button></div></form>`;
            expect(element.innerHTML).toBe(tagsRenderExpected);
        });

        it('should send "submit" event', async () => {
            const expectedSubmit = {};
            const spy = await page.spyOnEvent('onSubmit');
            const saveBtn = await element.find('button[type="submit"]');

            fields.forEach((field) => {
                expectedSubmit[field.name] = field.value;
            });

            saveBtn.click();
            await page.waitForChanges();
            expect(spy).toHaveReceivedEventDetail(expectedSubmit);
        });

        it('should listen for valueChange', async () => {
            const textField = await page.find('dot-textfield');
            const newValue = {
                name: 'field1',
                value: 'test2'
            };

            textField.triggerEvent('valueChange', {
                bubbles: true,
                cancelable: false,
                detail: newValue
            });

            formStatus = { ...formStatus, field1: 'test2' };

            await page.waitForChanges();
            element.getProperty('value').then((data) => {
                expect(data).toEqual(formStatus);
            });
        });

        it('should listen for statusChange, change form classes and invalidate Submit button', async () => {
            const textField = await page.find('dot-textfield');
            const newValue = {
                name: 'field1',
                status: {
                    dotPristine: false,
                    dotTouched: false,
                    dotValid: false
                }
            };

            textField.triggerEvent('statusChange', {
                bubbles: true,
                cancelable: false,
                detail: newValue
            });

            // tslint:disable-next-line:max-line-length
            const formStatusExpectedMarkup = `<dot-form submit-label=\"Saved\" reset-label=\"Reseted\" class=\"dot-untouched hydrated dot-invalid dot-dirty\"><form><dot-textfield class=\"dot-valid dot-pristine dot-untouched dot-required hydrated\"><div class=\"dot-field__label\"><label for=\"dot-field1\">field1</label><span class=\"dot-field__required-mark\">*</span></div><input id=\"dot-field1\" placeholder=\"\" required=\"\" type=\"text\"><span class=\"dot-field__hint\">hint1</span></dot-textfield><dot-textfield class=\"dot-valid dot-pristine dot-untouched hydrated\"><div class=\"dot-field__label\"><label for=\"dot-field2\">field2</label></div><input id=\"dot-field2\" placeholder=\"\" type=\"text\"><span class=\"dot-field__hint\">hint2</span></dot-textfield><div class=\"form__buttons\"><button type=\"button\">Reseted</button><button type=\"submit\" disabled=\"\">Saved</button></div></form></dot-form>`;
            await page.waitForChanges();
            expect(element.outerHTML).toBe(formStatusExpectedMarkup);
        });

        it('should reset event', async () => {
            const resetBtn = await element.find('button[type="button"]');
            const expectedStatus = Object.assign({}, formStatus);
            Object.keys(expectedStatus).forEach((e) => (expectedStatus[e] = ''));

            resetBtn.click();
            await page.waitForChanges();

            const data = await element.getProperty('value');
            expect(data).toEqual(expectedStatus);
        });
    });
});
