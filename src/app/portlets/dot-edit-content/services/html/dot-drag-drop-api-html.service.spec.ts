import { DotDragDropAPIHtmlService } from './dot-drag-drop-api-html.service';
import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';
import { EDIT_PAGE_JS } from './iframe-edit-mode.js';

const jsDragulaInlineElement = {};
let lastAppendChildCallElementParam;

@Injectable()
export class MockDotDOMHtmlUtilService {
    createInlineScriptElementlastCallDocParam;
    createInlineScriptElementLastCallTextParam;

    createLinkElement(doc: any, href: string): any {
        return null;
    }

    creatExternalScriptElement(doc: any, src: string, onLoadCallback?: () => void): any {
        return null;
    }

    createInlineScriptElement(doc: any, text: string): any {
        this.createInlineScriptElementlastCallDocParam = doc;
        this.createInlineScriptElementLastCallTextParam = text;
        return jsDragulaInlineElement;
    }
}

describe('DotDragDropAPIHtmlService', () => {
    let dotDragDropAPIHtmlService: DotDragDropAPIHtmlService;
    let dotDOMHtmlUtilService: MockDotDOMHtmlUtilService;

    const cssElement = {};
    const jsElement = {};
    let callbackFunc;

    const doc = {
        head: {
            appendChild(element: any): any {
                return null;
            }
        },
        body: {
            appendChild(element: any): any {
                lastAppendChildCallElementParam = element;
                return null;
            }
        }
    };

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                providers: [
                    DotDragDropAPIHtmlService,
                    { provide: DotDOMHtmlUtilService, useClass: MockDotDOMHtmlUtilService },
                ],
                imports: []
            });

            dotDragDropAPIHtmlService = TestBed.get(DotDragDropAPIHtmlService);
            dotDOMHtmlUtilService = TestBed.get(DotDOMHtmlUtilService);

            spyOn(dotDOMHtmlUtilService, 'createLinkElement').and.returnValue(cssElement);
            spyOn(doc.head, 'appendChild');

            spyOn(dotDOMHtmlUtilService, 'creatExternalScriptElement').and.callFake((element, src, callback) => {
                callbackFunc = callback;
            });
        })
    );

    it('should crate and set js and css draguls element', () => {
        dotDragDropAPIHtmlService.initDragAndDropContext(doc);

        expect(dotDOMHtmlUtilService.createLinkElement).toHaveBeenCalledWith(doc, '/html/js/dragula-3.7.2/dragula.min.css');
        expect(doc.head.appendChild).toHaveBeenCalledWith(cssElement);

        expect(dotDOMHtmlUtilService.creatExternalScriptElement).toHaveBeenCalledWith(
            doc, '/html/js/dragula-3.7.2/dragula.min.js', jasmine.any(Function));
            expect(doc.head.appendChild).toHaveBeenCalledWith(jsElement);
    });

    it('should init dragula context', () => {
        dotDragDropAPIHtmlService.initDragAndDropContext(doc);

        callbackFunc();

        expect(dotDOMHtmlUtilService.createInlineScriptElementlastCallDocParam).toEqual(doc);
        expect(dotDOMHtmlUtilService.createInlineScriptElementLastCallTextParam).toEqual(EDIT_PAGE_JS);

        expect(lastAppendChildCallElementParam).toEqual(jsDragulaInlineElement);
    });
});
