import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('dot-autocomplete', () => {
    let page: E2EPage;
    let element: E2EElement;

    beforeEach(async () => {
        page = await newE2EPage({
            html: `<dot-autocomplete></dot-autocomplete>`
        });

        element = await page.find('dot-autocomplete');
    });

    it('should render', () => {
        const renderExpected = '<input id=\"autoComplete\\d+\">';

        expect(element.innerHTML).toMatch(new RegExp(renderExpected));
    });

    it('should disabled', async () => {
        element.setAttribute('disabled', true);
        await page.waitForChanges();

        const renderExpected = '<input id=\"autoComplete\\d+\" disabled=\"\">';
        expect(element.innerHTML).toMatch(new RegExp(renderExpected));
    });

    it('should put a placeholder', async () => {
        element.setAttribute('placeholder', 'placeholder');
        await page.waitForChanges();

        const renderExpected = '<input id=\"autoComplete\\d+\" placeholder=\"placeholder\">';
        expect(element.innerHTML).toMatch(new RegExp(renderExpected));
    });

    describe('show options', () => {
        let input;

        beforeEach(async () => {
            await page.$eval('dot-autocomplete', (elm: any) => {
                elm.data = () => ['tag-1', 'label'];
            });

            await page.waitForChanges();

            input = await page.find('input');
            await input.press('t');
            await page.waitForChanges();
        });

        it('should put get data', async () => {
            // tslint:disable-next-line:max-line-length
            const renderExpected = '<input id=\"autoComplete\\d+\" placeholder=\"\"><ul id=\"autoComplete\\d+_results_list\"><li data-result=\"tag-1\" class=\"autoComplete_result\" tabindex=\"1\"><span class=\"autoComplete_highlighted\">t</span>ag-1</li></ul>';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should clean value and hide options when press esc', async () => {
            await input.press('Escape');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const renderExpected = '<input id=\"autoComplete\\d+\" placeholder=\"\"><ul id=\"autoComplete\\d+_results_list\"></ul>';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should clean options when lost focus', async (done) => {
            element.spyOnEvent('lostFocus').then(async () => {
                await page.waitForChanges();
                const options = await page.find('li');
                expect(options).toBeNull();
                done();
            });

            await input.triggerEvent('blur');
        });

    });

    describe('events', () => {
        let input;
        let spySelectionEvent;

        beforeEach(async () => {
            await page.$eval('dot-autocomplete', (elm: any) => {
                elm.data = () => ['tag-1', 'label'];
            });

            await page.waitForChanges();
            input = await page.find('input');

            spySelectionEvent = await element.spyOnEvent('selection');
        });

        it('should trigger selection event when press enter', async () => {
            await input.press('t');
            await input.press('e');
            await input.press('s');
            await input.press('t');
            await input.press('Enter');
            await page.waitForChanges();

            expect(spySelectionEvent).toHaveReceivedEventDetail('test');
        });

        it('should trigger selection event when click a option', async () => {
            await input.press('t');
            await page.waitForChanges();

            const option = await page.find('li');
            await option.press('Enter');
            await page.waitForChanges();

            expect(await page.find('li')).toBeNull();
            expect(spySelectionEvent).toHaveReceivedEventDetail('tag-1');
        });

        it('should trigger lost focus event', async (done) => {
            element.spyOnEvent('lostFocus').then(() => {
                done();
            });

            await input.triggerEvent('blur');
        });
    });

    describe('unvalid inputs', () => {
        it('should not broke when disabled is not a boolean', async () => {
            element.setAttribute('disabled', {});
            await page.waitForChanges();
            const renderExpected = '<input id=\"autoComplete\\d+\" disabled=\"\">';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should not broke when placeholder is not a string', async () => {
            element.setAttribute('placeholder', {});
            await page.waitForChanges();

            const renderExpected = '<input id=\"autoComplete\\d+\" placeholder=\"\\[object Object\\]\">';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should not broke when threshold is not a number', async () => {
            element.setAttribute('threshold', {});
            await page.waitForChanges();

            const renderExpected = '<input id=\"autoComplete\\d+\">';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should not broke when debounce is not a number', async () => {
            element.setAttribute('debounce', {});
            await page.waitForChanges();

            const renderExpected = '<input id=\"autoComplete\\d+\">';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should not broke when maxResults is not a number', async () => {
            element.setAttribute('maxResults', {});
            await page.waitForChanges();

            const renderExpected = '<input id=\"autoComplete\\d+\">';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });

        it('should not broke when data does is not a function', async () => {
            element.setAttribute('data', {});
            await page.waitForChanges();

            const renderExpected = '<input id=\"autoComplete\\d+\">';
            expect(element.innerHTML).toMatch(new RegExp(renderExpected));
        });
    });
});
