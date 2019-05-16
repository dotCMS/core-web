import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';
import { EventSpy } from '@stencil/core/dist/declarations';

describe('dot-tags', () => {
    let page: E2EPage;
    let element: E2EElement;

    describe('render and props', () => {
        beforeEach(async () => {
            page = await newE2EPage({
                html: `<dot-tags></dot-tags>`
            });

            element = await page.find('dot-tags');
        });

        it('should render', () => {
            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"dot-\"></label></div><div class=\"tag_container\"></div><dot-autocomplete class=\"hydrated\">.*</dot-autocomplete>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with name', async () => {
            element.setAttribute('name', 'testing');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"dot-testing\"></label></div><div class=\"tag_container\"></div><dot-autocomplete id=\"testing\" class=\"hydrated\">.*</dot-autocomplete>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with label', async () => {
            element.setAttribute('label', 'testing');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"dot-\">testing</label></div><div class=\"tag_container\"></div><dot-autocomplete class=\"hydrated\">.*</dot-autocomplete>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with hint', async () => {
            element.setAttribute('hint', 'hint');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"dot-\"></label></div><div class=\"tag_container\"></div><dot-autocomplete class=\"hydrated\">.*</dot-autocomplete><span class=\"dot-field__hint\">hint</span>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with paceholder', async () => {
            element.setAttribute('placeholder', 'placeholder');
            await page.waitForChanges();

            const autocomplete = await page.find('dot-tags dot-autocomplete');
            expect('placeholder').toBe(await autocomplete.getProperty('placeholder'));
        });

        it('should mark autocomplete and tag as disabled', async () => {
            element.setProperty('disabled', true);
            element.setProperty('value', 'tag-1');
            await page.waitForChanges();

            const autocomplete = await page.find('dot-tags dot-autocomplete');
            expect(await autocomplete.getProperty('disabled')).toBe(true);

            const tag = await page.find('dot-tags dot-chip');
            expect(await tag.getProperty('disabled')).toBe(true);
        });

        it('should mark any new tag as disabled', async () => {
            element.setProperty('disabled', true);
            await page.waitForChanges();

            element.setProperty('value', 'tag-1');
            await page.waitForChanges();

            const tag = await page.find('dot-tags dot-chip');
            expect(await tag.getProperty('disabled')).toBe(true);
        });
    });

    describe('status', () => {
        beforeEach(async () => {
            page = await newE2EPage({
                html: `<dot-tags name='tag'
                                 label='tag'>
                       </dot-tags>`
            });

            element = await page.find('dot-tags');
        });


        it('should load as pristine and untouched', () => {
            expect(element).toHaveClasses(['dot-pristine', 'dot-untouched']);
        });

        xit('should mark as dirty and touched when select a tag', async () => {
            const autocomplete = await page.find('dot-tags dot-autocomplete');
            await autocomplete.triggerEvent('selection', {detail: 'tag-1'});
            await page.waitForChanges();

            expect(element).toHaveClasses(['dot-dirty', 'dot-touched']);
        });

        xit('should mark as dirty and touched when remove a tag', async () => {

        });

        it('should clear value, set pristine and untouched  when input set reset', async () => {
            element.callMethod('reset');
            await page.waitForChanges();

            expect(element).toHaveClasses(['dot-pristine', 'dot-untouched', 'dot-valid']);
        });
    });

    describe('emit events', () => {
        let spyStatusChangeEvent: EventSpy;
        let spyValueChange: EventSpy;

        beforeEach(async () => {
            page = await newE2EPage({
                html: `<dot-tags name='tag'
                                 label='tag'>
                       </dot-tags>`
            });

            spyStatusChangeEvent = await page.spyOnEvent('statusChange');
            spyValueChange = await page.spyOnEvent('valueChange');
            element = await page.find('dot-tags');
        });

        xit('should emit status event when blur', async () => {
            const autocomplete = await page.find('dot-autocomplete');
            await autocomplete.triggerEvent('lostFocus');
            await page.waitForChanges();

            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'tag',
                status: {
                    dotPristine: true,
                    dotTouched: true,
                    dotValid: true
                }
            });
        });

        xit('should send status when autocomplete value is selection', async () => {
            const autocomplete = await page.find('dot-tags dot-autocomplete');
            await autocomplete.triggerEvent('selection', {detail: 'tag-1'});

            await page.waitForChanges();

            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'fullName',
                status: {
                    dotPristine: false,
                    dotTouched: true,
                    dotValid: true
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({
                name: 'fullName',
                value: 'Johna'
            });
        });

        xit('should send status when a tag is remove', async () => {

        });

        it('should emit status and value on Reset', async () => {
            element.callMethod('reset');
            await page.waitForChanges();

            expect(spyStatusChangeEvent).toHaveReceivedEventDetail({
                name: 'tag',
                status: {
                    dotPristine: true,
                    dotTouched: false,
                    dotValid: true
                }
            });
            expect(spyValueChange).toHaveReceivedEventDetail({ name: 'tag', value: '' });
        });

        it('should be unvalid when not have any value and is mark as required', async () => {
            element.setAttribute('required', true);
            await page.waitForChanges();

            expect(element).toHaveClasses(['dot-invalid']);
        });

        it('should be valid when not have any value and is not mark as required', async () => {
            element.setAttribute('required', false);
            await page.waitForChanges();

            expect(element).toHaveClasses(['dot-valid']);
        });
    });

    describe('unvalid inputs', () => {
        it('should not broke when value does not have comma', async () => {
            element.setAttribute('value', 'tag-1');
            await page.waitForChanges();

            expect(element.getAttribute('value')).toBe('tag-1');
        });

        it('should not broke when value is not a string', async () => {
            element.setAttribute('value', {});
            await page.waitForChanges();

            expect(element.getAttribute('value')).toBe('[object Object]');
        });

        it('should not broke when name is not a string', async () => {
            element.setAttribute('name', {});
            await page.waitForChanges();

            expect(element.getAttribute('name')).toBe('[object Object]');
        });

        it('should not broke when label is not a string', async () => {
            element.setAttribute('label', {});
            await page.waitForChanges();

            expect(element.getAttribute('label')).toBe('[object Object]');
        });

        it('should not broke when hint is not a string', async () => {
            element.setAttribute('hint', {});
            await page.waitForChanges();

            expect(element.getAttribute('hint')).toBe('[object Object]');
        });

        it('should not broke when placeholder is not a string', async () => {
            element.setAttribute('placeholder', {});
            await page.waitForChanges();

            expect(element.getAttribute('placeholder')).toBe('[object Object]');
        });

        it('should not broke when disabled is not a boolean', async () => {
            element.setAttribute('disabled', {});
            await page.waitForChanges();

            expect(element.getAttribute('disabled')).toBeTruthy();
        });

        it('should not broke when required is not a boolean', async () => {
            element.setAttribute('required', {});
            await page.waitForChanges();

            expect(element.getAttribute('required')).toBeTruthy();
        });

        it('should not broke when requiredMessage is not a string', async () => {
            element.setAttribute('requiredMessage', {});
            await page.waitForChanges();

            expect(element.getAttribute('requiredMessage')).toBe('[object Object]');
        });
    });
});
