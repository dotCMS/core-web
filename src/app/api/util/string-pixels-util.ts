import * as _ from 'lodash';
export class StringPixels {
    private static readonly characterSize = 7;

    /**
     * Returns an estimate of the width that may have the longer text
     * from a collection, based on a character constant
     * @param {Array<string>} textValues The text to be measure.
     *
     */
    public static getWidth(textValues: Array<string>): number {
        const maxText = _.maxBy(textValues, (text: string) => text.length).length;
        return this.characterSize * maxText > 108 ? 108 : this.characterSize * maxText;
    }
}
