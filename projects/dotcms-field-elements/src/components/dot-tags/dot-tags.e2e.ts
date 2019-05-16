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
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"\"></label></div><div class=\"tag_container\"></div><dot-autocomplete class=\"hydrated\">.*</dot-autocomplete>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with name', async () => {
            element.setAttribute('name', 'testing');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"testing\"></label></div><div class=\"tag_container\"></div><dot-autocomplete id=\"testing\" class=\"hydrated\">.*</dot-autocomplete>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with label', async () => {
            element.setAttribute('label', 'testing');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"\">testing</label></div><div class=\"tag_container\"></div><dot-autocomplete class=\"hydrated\">.*</dot-autocomplete>`;
            expect(element.innerHTML).toMatch(new RegExp(tagsRenderExpected));
        });

        it('should render with hint', async () => {
            element.setAttribute('hint', 'hint');
            await page.waitForChanges();

            // tslint:disable-next-line:max-line-length
            const tagsRenderExpected = `<div class=\"dot-field__label\"><label for=\"\"></label></div><div class=\"tag_container\"></div><dot-autocomplete class=\"hydrated\">.*</dot-autocomplete><span class=\"dot-field__hint\">hint</span>`;
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

            const tag = await page.find('dot-tags dot-tag');
            expect(await tag.getProperty('disabled')).toBe(true);
        });

        it('should mark any new tag as disabled', async () => {
            element.setProperty('disabled', true);
            await page.waitForChanges();

            element.setProperty('value', 'tag-1');
            await page.waitForChanges();

            const tag = await page.find('dot-tags dot-tag');
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

        it('should emit status event when blur', async () => {
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

        /*
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

        it('should be unvalid when not have any value and is mark as required', async () => {
        });

        it('should be valid when not have any value and is not mark as required', async () => {
        });*/
    });

    /*describe('unvalid inputs', () => {
        it('should not broke when value does'nt have comma, async () => {
        });

        it('should not broke when value is not a string, async () => {
        });

        it('should not broke when name is not a string, async () => {
        });

        it('should not broke when label is not a string, async () => {
        });

        it('should not broke when hint is not a string, async () => {
        });

        it('should not broke when placeholder is not a string, async () => {
        });

        it('should not broke when disabled is not a boolean, async () => {
        });

        it('should not broke when required is not a boolean, async () => {
        });

        it('should not broke when requiredMessage is not a string, async () => {
        });
    });
    */
});
