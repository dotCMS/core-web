import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('dot-autocomplete', () => {
    let page: E2EPage;
    let element: E2EElement;

    const getInput = () => page.find('input');

    beforeEach(async () => {
        page = await newE2EPage({
            html: '<dot-autocomplete></dot-autocomplete>'
        });

        await page.$eval('dot-autocomplete', (elm: any) => {
            elm.data = () => [
                'result-1',
                'result-2',
                'result-3',
                'result-4',
                'result-5',
                'result-6'
            ];
        });

        element = await page.find('dot-autocomplete');
        await page.waitForChanges();
    });

    describe('@Props', () => {
        describe('disabled', () => {
            it('should render', async () => {
                element.setAttribute('disabled', true);
                await page.waitForChanges();
                const input = await getInput();
                expect(input.getAttribute('disabled')).toBeDefined();
            });

            it('should not render', async () => {
                const input = await getInput();
                expect(input.getAttribute('disabled')).toBeNull();
            });
        });

        describe('placeholder', () => {
            it('should render', async () => {
                element.setAttribute('placeholder', 'some placeholder');
                await page.waitForChanges();
                const input = await getInput();
                expect(input.getAttribute('placeholder')).toBe('some placeholder');
            });

            it('should not render', async () => {
                const input = await getInput();
                expect(input.getAttribute('placeholder')).toBe('');
            });
        });

        describe('id', () => {
            it('should render', async () => {
                const input = await getInput();
                expect(input.getAttribute('id').startsWith('autoComplete')).toBe(true);
            });
        });

        describe('threshold', () => {
            let input: E2EElement;

            beforeEach(async () => {
                element.setAttribute('threshold', 2);
                await page.waitForChanges();
                input = await page.find('input');
            });

            it('should show results after when meet', async () => {
                await input.type('res');
                await page.waitForChanges();

                const ul = await element.find('ul');
                expect(ul.innerHTML).toEqualHtml(`
                    <li class="autoComplete_result" data-result="result-1" tabindex="1">
                        <span class="autoComplete_highlighted">
                            res
                        </span>
                        ult-1
                    </li>
                    <li class="autoComplete_result" data-result="result-2" tabindex="1">
                        <span class="autoComplete_highlighted">
                            res
                        </span>
                        ult-2
                    </li>
                    <li class="autoComplete_result" data-result="result-3" tabindex="1">
                        <span class="autoComplete_highlighted">
                            res
                        </span>
                        ult-3
                    </li>
                    <li class="autoComplete_result" data-result="result-4" tabindex="1">
                        <span class="autoComplete_highlighted">
                            res
                        </span>
                        ult-4
                    </li>
                    <li class="autoComplete_result" data-result="result-5" tabindex="1">
                        <span class="autoComplete_highlighted">
                            res
                        </span>
                        ult-5
                    </li>
                `);
            });

            it('should not show results before when meet', async () => {
                input.type('re');
                await page.waitForChanges();

                const ul = await element.find('ul');
                expect(ul.innerHTML).toBe('');
            });
        });

        describe('maxResults', () => {
            let input;

            it('should show 5 (default) results', async () => {
                input = await page.find('input');
                input.type('res');
                await page.waitForChanges();

                const lis = await element.findAll('ul li');
                expect(lis.length).toBe(5);
            });

            it('should show 3 results', async () => {
                element.setAttribute('max-results', 3);
                await page.waitForChanges();
                input = await page.find('input');

                input.type('res');
                await page.waitForChanges();

                const lis = await element.findAll('ul li');
                expect(lis.length).toBe(3);
            });
        });

        describe('debounce', () => {});

        describe('data', () => {});
    });

    describe('@Events', () => {
        let input;
        let spySelectionEvent;

        beforeEach(async () => {
            input = await page.find('input');
            spySelectionEvent = await element.spyOnEvent('selection');
        });

        describe('selection', () => {
            it('should trigger when press enter', async () => {
                await input.type('test');
                input.press('Enter');
                await page.waitForChanges();

                expect(spySelectionEvent).toHaveReceivedEventDetail('test');
            });

            it('should trigger when keyboard select a option', async () => {
                input.type('res');
                await page.waitForChanges();

                element.press('ArrowDown');
                element.press('ArrowDown');
                element.press('ArrowDown');
                element.press('Enter');
                await page.waitForChanges();

                expect(spySelectionEvent).toHaveReceivedEventDetail('result-3');
            });
        });

        describe('lostFocus', () => {
            it('should trigger on blur', async (done) => {
                element.spyOnEvent('lostFocus').then(() => {
                    done();
                });

                await input.triggerEvent('blur');
            });
        });
    });

    describe('Keyboard', () => {
        let input;

        beforeEach(async () => {
            input = await page.find('input');
        });

        it('should clear on esc', async () => {
            input.type('res');
            await page.waitForChanges();
            let lis = await element.findAll('ul li');

            expect(await input.getProperty('value')).toBe('res');
            expect(lis.length).toBe(5);

            input.press('Escape');
            await page.waitForChanges();
            lis = await element.findAll('ul li');

            expect(await input.getProperty('value')).toBe('');
            expect(lis.length).toBe(0);
        });
    });
});
