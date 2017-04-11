import {Injectable} from '@angular/core';

@Injectable()
export class ColorUtil {
    /* Check color brightness
     * returns brightness value from 0 to 255
     * http://www.webmasterworld.com/forum88/9769.htm
     */
    public getBrightness(hexCode): number {
        let isHexCode = hexCode.indexOf('#') !== -1;

        if (isHexCode) {
            // strip off any leading #
            hexCode = hexCode.replace('#', '');
        }else {
            hexCode = this.rgb2hex(hexCode);
        }

        let c_r = parseInt(hexCode.substr(0, 2), 16);
        let c_g = parseInt(hexCode.substr(2, 2), 16);
        let c_b = parseInt(hexCode.substr(4, 2), 16);

        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    }

    /* convert RGB to hex
     * http://stackoverflow.com/questions/1740700/get-hex-value-rather-than-rgb-value-using-jquery
     */
    public rgb2hex(rgb): string {
        if (  rgb.search('rgb') === -1 ) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d+))?\)$/));

            return '#' + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
        }
    }

    private hex(x: string): string {
        return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }
}