import { Injectable } from '@angular/core';
import { EDIT_PAGE_JS, EDIT_PAGE_JS_DOJO_REQUIRE } from './libraries/iframe-edit-mode.js.js';
import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';
import AUTOSCROLLER_JS from './libraries/autoscroller.js.js';
import DRAGULA_JS from './libraries/dragula.min.js.js';

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
    public initDragAndDropContext(iframe: any): void {
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const dragulaCSSElement = document.createElement('style');
        dragulaCSSElement.innerHTML = `
        .gu-mirror {
            position: fixed !important;
            margin: 0 !important;
            z-index: 9999 !important;
            opacity: 1;
            transform: scale(0.5);
            transform-origin: right top;
        }

        .gu-hide {
            display: none !important;
        }
        .gu-unselectable {
            user-select: none !important;
        }
        `;

        doc.head.appendChild(dragulaCSSElement);

        // If the page has DOJO, we need to inject the Dragula dependency with require.
        if (iframe.contentWindow.hasOwnProperty('dojo')) {
            doc.body.appendChild(
                this.dotDOMHtmlUtilService.createInlineScriptElement(EDIT_PAGE_JS_DOJO_REQUIRE)
            );
        } else {
            this.initDragula(doc);
        }
    }

    private initDragula(doc: any): any {
        const dragAndDropScript = this.dotDOMHtmlUtilService.createInlineScriptElement(
            `
            ${DRAGULA_JS}
            ${AUTOSCROLLER_JS}
            ${EDIT_PAGE_JS}
            `
        );
        doc.body.appendChild(dragAndDropScript);
    }
}
