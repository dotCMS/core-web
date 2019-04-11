import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-textfield', () => {
    let page: E2EPage;
    let element: E2EElement;
    let input: E2EElement;
    let spyStatusChangeEvent: EventSpy;
    let spyValueChanges: EventSpy;
    beforeEach(async () => {
        page = await newE2EPage({
            html: `
              <dot-textfield
                    label='Name:'
                    name='fullName'
                    value='John'
                    hint='this is a hint'
                    placeholder='Enter Name'
                    regexcheck='^[A-Za-z ]+$'
                    regexcheckmessage="Invalid Name"
                    required
                    requiredmessage="Required Name"
                ></dot-textfield>`
        });

        spyStatusChangeEvent = await page.spyOnEvent('statusChanges');
        spyValueChanges = await page.spyOnEvent('valueChanges');
        element = await page.find('dot-textfield');
        input = await page.find('input');
    });

    it('should render', async () => {
        const tagsRenderExpected = `<label>Name:</label><input name="fullName" type="text" placeholder="Enter Name" required=""><span class="dot-textfield__hint">this is a hint</span>`;
        expect(element.innerHTML).toBe(tagsRenderExpected);
    });

    it('should show Regex validation message', async () => {
        await input.press('@');
        await page.waitForChanges();
        const errorMessage = await page.find('.dot-textfield__error-meessage');
        expect(errorMessage.innerHTML).toBe('Invalid Name');
    });

    describe('emit statusChanges', () => {
        //TODO: In progress...
        it('should send status onBlur', async () => {
            await page.$eval('input', (e: HTMLElement) => e.blur());
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                dotPristine: false,
                dotTouched: true,
                dotValid: true
            });
        });

        it('should send status value change', async () => {
            input.press('a');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                dotPristine: false,
                dotTouched: true,
                dotValid: true
            });
        });

        it('should send status on Reset', async () => {
            element.callMethod('reset');
            await page.waitForChanges();
            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                dotPristine: true,
                dotTouched: false,
                dotValid: false
            });
        });
    });

    it('should emit change value', async () => {
        input.press('a');
        await page.waitForChanges();
        expect(spyValueChanges).toHaveReceivedEventDetail({ name: 'fullName', value: 'Johna' });
    });

    it('should load as pristine and untouched', async () => {
        expect(element.classList.contains('dot-pristine')).toBeTruthy();
        expect(element.classList.contains('dot-untouched')).toBeTruthy();
    });

    //TODO: In progress...
    it('should mark as touched when onblur', async () => {
        // input.press('@');
        await page.waitForChanges();
        expect(element.classList.contains('dot-touched')).toBeTruthy();
    });

    it('should mark as dirty and touched when type', async () => {
        input.press('a');
        await page.waitForChanges();
        expect(element.classList.contains('dot-dirty')).toBeTruthy();
        expect(element.classList.contains('dot-touched')).toBeTruthy();
    });

    it('should mark as invalid when value dont match REgex', async () => {
        input.press('@');
        await page.waitForChanges();
        expect(element.classList.contains('dot-invalid')).toBeTruthy();
    });

    it('should clear value, set pristine and untouched  when input set reset', async () => {
        element.callMethod('reset');
        await page.waitForChanges();

        expect(element.classList.contains('dot-pristine')).toBeTruthy();
        expect(element.classList.contains('dot-untouched')).toBeTruthy();
        expect(element.classList.contains('dot-invalid')).toBeTruthy();
        expect(await input.getProperty('value')).toBe('');
    });

    it('should mark as disabled when prop is present', async () => {
        element.setProperty('disabled', true);
        await page.waitForChanges();
        expect(await input.getProperty('disabled')).toBeTruthy();
    });

    it('should mark as required when prop is present', async () => {
        expect(await input.getProperty('required')).toBeTruthy();
    });
});
