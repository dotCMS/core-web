import {Injectable} from '@angular/core';


/**
 * Encapsulate string utils methods.
 */
@Injectable()
export class StringUtils {

    constructor() {

    }

    /**
     * Get from text, the line number (indexLine), null if it does not exists.
     * @param text
     * @param indexLine
     * @returns {string}
     */
    getLine(text: string, indexLine: number): string {

        let line: string = null;

        if (text) {

            let lines = text.split('\n');
            line      = (lines && lines.length > indexLine)?
                                lines[indexLine]: null;
        }

        return line;
    } // getLine.

    /**
     * Get slug from a string, that means: "this kind of text" to "this-kind-of-text"
     * @param text
     * @returns {string}
     */
    sluglify(text: string): string {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

} // E:O:F:StringUtils.