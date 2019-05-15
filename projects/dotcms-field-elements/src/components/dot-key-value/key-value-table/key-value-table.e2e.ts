import { newE2EPage, E2EElement, E2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('key-value-table', () => {
    let page: E2EPage;
    let element: E2EElement;
    let spyDeleteItemEvent: EventSpy;

    beforeEach(async () => {
        page = await newE2EPage();
        await page.setContent(`<key-value-table />`);
        element = await page.find('key-value-table');
        element.setProperty('items', [{ key: 'keyA', value: '1' }, { key: 'keyB', value: '2' }]);
        await page.waitForChanges();
    });

    it('renders', async () => {
        // tslint:disable-next-line:max-line-length
        const expectedMarkup = `<key-value-table class=\"hydrated\"><table><tbody><tr><td><button aria-label=\"Delete keyA, 1\" type=\"button\" class=\"dot-key-value__delete__button\">Delete</button></td><td>keyA</td><td>1</td></tr><tr><td><button aria-label=\"Delete keyB, 2\" type=\"button\" class=\"dot-key-value__delete__button\">Delete</button></td><td>keyB</td><td>2</td></tr></tbody></table></key-value-table>`;
        expect(element.outerHTML).toBe(expectedMarkup);
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
