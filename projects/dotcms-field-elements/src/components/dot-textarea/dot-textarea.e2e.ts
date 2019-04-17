import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

fdescribe('dot-textarea', () => {
    let page: E2EPage;

    describe('dot-textarea', () => {
        let element: E2EElement;
        let input: E2EElement;

        beforeEach(async () => {
            page = await newE2EPage({
                html: `
                <dot-textarea
                    label='Address:'
                    name='Address'
                    value='Address'
                    regexcheck='^[A-Za-z ]+$'
                    regexcheckmessage="Invalid Address"
                    required
                    requiredmessage="Required Address">
                </dot-textarea>`
            });

            element = await page.find('dot-textfield');
            input = await page.find('input');
        });

        it('should render', async () => {
            const tagsRenderExpected = `<label>Address:</label><textarea name="Address" required=""></textarea>`;
            expect(element.innerHTML).toBe(tagsRenderExpected);
        });

        it('should show Regex validation message', async () => {
            await input.press('@');
            await page.waitForChanges();
            const errorMessage = await page.find('.dot-field__error-meessage');
            expect(errorMessage.innerHTML).toBe('Invalid Address');
        });
    });

    it('should render with hint', async () => {
        page = await newE2EPage({
            html: `
              <dot-textarea
                label='Address:'
                name='Address'
                value='Address'
                regexcheck='^[A-Za-z ]+$'
                regexcheckmessage="Invalid Address"
                required
                requiredmessage="Required Address"
                hint="this is a hint">
              </dot-textarea>`
        });

        element = await page.find('dot-textarea');

        const tagsRenderExpected = `<label>Address:</label><textarea name="Address" required=""></textarea><span class="dot-field__hint">this is a hint</span>`;
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });


    /*it('should load as pristine and untouched', () => {
        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
    });

    xit('should mark as touched when onblur', () => {
        // TODO: Need to find the way to test the blur event.
    });

    it('should mark as dirty and touched when type', async () => {
        input.press('a');
        await page.waitForChanges();
        expect(element.classList.contains('dot-dirty')).toBe(true);
        expect(element.classList.contains('dot-touched')).toBe(true);
    });

    it('should mark as invalid when value dont match REgex', async () => {
        input.press('@');
        await page.waitForChanges();
        expect(element.classList.contains('dot-invalid')).toBe(true);
    });

    it('should clear value, set pristine and untouched  when input set reset', async () => {
        element.callMethod('reset');
        await page.waitForChanges();

        expect(element.classList.contains('dot-pristine')).toBe(true);
        expect(element.classList.contains('dot-untouched')).toBe(true);
        expect(element.classList.contains('dot-invalid')).toBe(true);
        expect(await input.getProperty('value')).toBe('');
    });

    it('should mark as disabled when prop is present', async () => {
        element.setProperty('disabled', true);
        await page.waitForChanges();
        expect(await input.getProperty('disabled')).toBe(true);
    });

    it('should mark as required when prop is present', async () => {
        expect(await input.getProperty('required')).toBe(true);
    });

    describe('emit events', () => {
        xit('should send status onBlur', async () => {
            // TODO: Need to find the way to test the blur event.
            // await page.$eval('input', (e: HTMLInputElement) => {
            //     e.blur();
            // });
        });

        it('should send status value change', async () => {
            input.press('a');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                status: {
                    dotPristine: false,
                    dotTouched: true,
                    dotValid: true
                }
            });
        });

        it('should emit status and value on Reset', async () => {
            element.callMethod('reset');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                status: {
                    dotPristine: true,
                    dotTouched: false,
                    dotValid: false
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({ name: 'fullName', value: '' });
        });

        it('should emit change value', async () => {
            input.press('a');
            await page.waitForChanges();
            expect(spyValueChange).toHaveReceivedEventDetail({ name: 'fullName', value: 'Johna' });
        });
    });*/
});
