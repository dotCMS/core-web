export class StringPixels {
    characterSize = 7;

    /**
     * Returns an estimate of the width that may have a text rendered based on
     * a character constant
     * @param {String} text The text to be measure.
     *
     */
    public getTextWidth(text: string): number {
        return this.characterSize * text.length;
    }
}
