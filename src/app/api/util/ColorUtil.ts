import {Injectable} from '@angular/core';

/**
 * Miscellaneous Color utility methods.
 */
@Injectable()
export class ColorUtil {

    private static readonly HEX_BASE = 16;
    private static readonly RED_COLOR_RGB_START = 0;
    private static readonly GREEN_COLOR_RGB_START = 2;
    private static readonly BLUE_COLOR_RGB_START = 4;
    private static readonly COLOR_RGB_LENGTH = 2;
    private static readonly BRIGHTNESS_BOUNDARY = 138;

    /**
     * Check color brightness.
     *
     * @param color color to check, it could be in hex or rgb format
     * @return brightness value from 0 to 255, where 255 is brigthest.
     * @see http://www.webmasterworld.com/forum88/9769.htm
     */
    public getBrightness(color): number {
        let isHexCode = color.indexOf('#') !== -1;

        if (isHexCode) {
            // strip off any leading #
            color = color.replace('#', '');
        }else {
            color = this.rgb2hex(color);
        }

        let c_r = parseInt(color.substr(ColorUtil.RED_COLOR_RGB_START, ColorUtil.COLOR_RGB_LENGTH), ColorUtil.HEX_BASE);
        let c_g = parseInt(color.substr(ColorUtil.GREEN_COLOR_RGB_START, ColorUtil.COLOR_RGB_LENGTH), ColorUtil.HEX_BASE);
        let c_b = parseInt(color.substr(ColorUtil.BLUE_COLOR_RGB_START, ColorUtil.COLOR_RGB_LENGTH), ColorUtil.HEX_BASE);

        // tslint:disable-next-line:no-magic-numbers
        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    }

    /**
     * Return true if hexCode is a bright color
     * @param color color to check, it could be in hex or rgb format
     */

    public isBrightness(color): boolean {
        return this.getBrightness(color) > ColorUtil.BRIGHTNESS_BOUNDARY;
    }

    /**
     * Convert RGB color format to hex color format, for example, if you have rgb(0,0,0) return #000
     * @see http://stackoverflow.com/questions/1740700/get-hex-value-rather-than-rgb-value-using-jquery
     */
    public rgb2hex(rgb): string {
        if (  rgb.search('rgb') === -1 ) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)$/);

            // tslint:disable-next-line:no-magic-numbers
            return '#' + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
        }
    }

    private hex(x: string): string {
        // tslint:disable-next-line:no-magic-numbers
        return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }
}