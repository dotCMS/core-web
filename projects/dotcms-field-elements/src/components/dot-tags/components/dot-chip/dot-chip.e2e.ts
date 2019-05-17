import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('dot-chip', () => {
    let page: E2EPage;
    let element: E2EElement;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `<dot-chip label='test-tag'></dot-chip>`
        });

        element = await page.find('dot-chip');
    });

    it('should render', () => {
        const tagsRenderExpected = '<span>test-tag</span><button type=\"button\">delete</button>';
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });

    it('should render with deleteLabel', async () => {
        element.setAttribute('delete-label', 'x');
        await page.waitForChanges();

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

        const tagsRenderExpected = '<span>test-tag</span><button type=\"button\" disabled=\"\">delete</button>';
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });
});
