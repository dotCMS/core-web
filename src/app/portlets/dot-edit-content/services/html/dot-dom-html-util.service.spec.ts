import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';
import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('DotDOMHtmlUtilService', () => {
    let dotDOMHtmlUtilService: DotDOMHtmlUtilService;
    const doc = {
        createElement(tagName: string): any {
            return null;
        }
    };

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                providers: [DotDOMHtmlUtilService],
                imports: []
            });

            dotDOMHtmlUtilService = TestBed.get(DotDOMHtmlUtilService);
        })
    );

    it('should create a link element', () => {
        const href = 'https://testing/test.css';
        const cssElement = {};

        spyOn(doc, 'createElement').and.returnValue(cssElement);

        const cssElementCreated = dotDOMHtmlUtilService.createLinkElement(doc, href);

        expect(doc.createElement).toHaveBeenCalledWith('link');
        expect(cssElementCreated).toEqual(cssElement);
        expect(cssElementCreated.rel).toEqual('stylesheet');
        expect(cssElementCreated.type ).toEqual('text/css');
        expect(cssElementCreated.media).toEqual('all');
        expect(cssElementCreated.href).toEqual(href);
    });

    it('should create a external script', () => {
        const src = 'https://testing/test.js';
        const scriptElement = {};
        const onloadCallbackFunc = () => {};

        spyOn(doc, 'createElement').and.returnValue(scriptElement);

        const scriptElementCreated = dotDOMHtmlUtilService.creatExternalScriptElement(doc, src, onloadCallbackFunc);
        expect(doc.createElement).toHaveBeenCalledWith('script');
        expect(scriptElementCreated).toEqual(scriptElement);
        expect(scriptElementCreated.src).toEqual(src);
        expect(scriptElementCreated.onload).toEqual(onloadCallbackFunc);
    });

    it('should create a inline script', () => {
        const text = 'var a = 2;';
        const scriptElement = {};

        spyOn(doc, 'createElement').and.returnValue(scriptElement);

        const scriptElementCreated = dotDOMHtmlUtilService.createInlineScriptElement(doc, text);
        expect(doc.createElement).toHaveBeenCalledWith('script');
        expect(scriptElementCreated).toEqual(scriptElement);
        expect(scriptElementCreated.text).toEqual(text);
    });
});
