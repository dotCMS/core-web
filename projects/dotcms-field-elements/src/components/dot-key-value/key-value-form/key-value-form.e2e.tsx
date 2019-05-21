import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('key-value-form', () => {
    let page: E2EPage;
    let element: E2EElement;
    let spyDeleteItemEvent: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage();
        await page.setContent(`<key-value-form />`);
        element = await page.find('key-value-form');
        element.setProperty('items', [{ key: 'keyA', value: '1' }, { key: 'keyB', value: '2' }]);
        await page.waitForChanges();
    });


    describe('Events', () => {
        beforeEach(async () => {
            spyDeleteItemEvent = await page.spyOnEvent('deleteItemEvt');
        });

        it('should emit "deleteItemEvt" when deleting an item', async () => {
            const deleteBtn = await page.find('button');
            deleteBtn.click();
            await page.waitForChanges();
            expect(spyDeleteItemEvent).toHaveReceivedEventDetail(0);
        });
    });
});
