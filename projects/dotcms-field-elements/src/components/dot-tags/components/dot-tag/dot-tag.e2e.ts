import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('dot-tag', () => {
    let page: E2EPage;
    let element: E2EElement;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `<dot-tag label='test-tag'></dot-tag>`
        });

        element = await page.find('dot-tag');
    });

    it('should render', () => {
        // tslint:disable-next-line:max-line-length
        const tagsRenderExpected = '<span>test-tag</span><button type=\"button\">x</button>';
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });

    it('should trigger remove event', async () => {
        const spyRemoveEvent = await element.spyOnEvent('remove');

        const removeButton = await page.find('button');
        await removeButton.triggerEvent('click');
        await page.waitForChanges();

        expect(spyRemoveEvent).toHaveReceivedEventDetail('test-tag');
    });

    it('should be disabled', async () => {
        element.setAttribute('disabled', true);
        await page.waitForChanges();

        const tagsRenderExpected = '<span>test-tag</span><button type=\"button\" disabled=\"\">x</button>';
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });
});
