import { Injectable } from '@angular/core';
import { getEditPageJS, getEditPageJSDojoRequire } from './iframe-edit-mode.js';
import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';

const API_ROOT_PATH = '/html/js/dragula-3.7.2';

/**
 * Util class for init the dragula API.
 * for more information see: https://github.com/bevacqua/dragula
 */
@Injectable()
export class DotDragDropAPIHtmlService {
    constructor(private dotDOMHtmlUtilService: DotDOMHtmlUtilService) {}

    /**
     * Init the edit-content's drag and drop context, this make the follow steps:
     * - Load the css dragula file
     * - Load the js dragula file, either with required (if DOJO is present) or directly.
     * - Inject dragula init code from iframe-edit-mode.js
     */
    public initDragAndDropContext(iframe: any, remoteRendered: boolean): void {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const dragulaCSSElement = this.dotDOMHtmlUtilService.createLinkElement(
            `${API_ROOT_PATH}/dragula.min.css`
        );

        doc.head.appendChild(dragulaCSSElement);
        const dragulaJSElement = this.dotDOMHtmlUtilService.creatExternalScriptElement(
            `${API_ROOT_PATH}/dragula.min.js`,
            () => this.initDragula(doc, remoteRendered)
        );
        // If the page has DOJO, we need to inject the Dragula dependency with require.
        if (iframe.contentWindow.hasOwnProperty('dojo')) {
            doc.body.appendChild(
                this.dotDOMHtmlUtilService.createInlineScriptElement(getEditPageJSDojoRequire(remoteRendered))
            );
        } else {
            doc.body.appendChild(dragulaJSElement);
        }
    }

    private initDragula(doc: any, remoteRendered: boolean): any {
        const dragAndDropScript = this.dotDOMHtmlUtilService.createInlineScriptElement(
            getEditPageJS(remoteRendered)
        );
        doc.body.appendChild(dragAndDropScript);
    }
}
