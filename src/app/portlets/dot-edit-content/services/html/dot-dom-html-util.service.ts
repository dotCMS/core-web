import { Injectable } from '@angular/core';

const JS_MIME_TYPE = 'text/javascript';
const CSS_MIME_TYPE = 'text/css';

/**
 * Util class for work directly with DOM element
 */
@Injectable()
export class DotDOMHtmlUtilService {

    public createLinkElement(doc: any, href: string): any {
        const dragulaCss = doc.createElement('link');
        dragulaCss.rel = 'stylesheet';
        dragulaCss.type = CSS_MIME_TYPE;
        dragulaCss.media = 'all';
        dragulaCss.href = href;

        return dragulaCss;
    }

    public creatExternalScriptElement(doc: any, src: string, onLoadCallback?: () => void): any {
        const script = this.createScriptElement(doc);
        script.src = src;
        script.onload = onLoadCallback;

        return script;
    }

    public createInlineScriptElement(doc: any, text: string): any {
        const script = this.createScriptElement(doc);
        script.text = text;

        return script;
    }

    private createScriptElement(doc: any): any {
        const script = doc.createElement('script');
        script.type = JS_MIME_TYPE;
        return script;
    }
}
