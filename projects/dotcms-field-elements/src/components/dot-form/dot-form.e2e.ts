import { newE2EPage, E2EPage, E2EElement } from '@stencil/core/testing';
import { DotFormComponent } from './dot-form';

fdescribe('dot-form', () => {
    let page: E2EPage;
    let element: E2EElement;

    beforeEach(async () => {
        page = await newE2EPage();
        await page.setContent(
            '<dot-form submit-label="Save" reset-label="Reset"><h1>Test</h1></dot-form>'
        );
        element = await page.find('dot-form');
    });

    it('should renders', async () => {
        const tagsRenderExpected = `<form><h1>Test</h1><input type="submit" value="Save"><input type="button" value="Reset"></form>`;
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });

    it('should send "formSubmit" event', async () => {
        const spy = await page.spyOnEvent('formSubmit');
        const saveBtn = await element.find('input[type="submit"]');
        saveBtn.click();
        await page.waitForChanges();
        expect(spy).toHaveReceivedEvent();
    });

    it('should send reset form', async () => {
        // page.
        const formObj = new DotFormComponent();
        // formObj.el.appendChild(new HTMLElement);
        formObj.el = {};
        formObj._formValues = { name: 'test' };
        formObj.resetForm();
        // const resetBtn = await element.find('input[type="button"]');
        // resetBtn.click();
        // await page.waitForChanges();
        console.log(formObj);
    });
});
