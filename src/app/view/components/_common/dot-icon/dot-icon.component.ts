import { Component, Input } from '@angular/core';

/**
 * The DotIconComponent uses google material design icons
 * https://material.io/tools/icons
 * @export
 * @class DotIconComponent
 */
@Component({
    selector: 'dot-icon',
    styleUrls: ['./dot-icon.component.scss'],
    template: `<i class="material-icons {{ this.tiny ? 'tiny' : '' }} {{ this.invertColor ? 'invert-color' : '' }}">
                    {{ this.name }}
               </i>`
})
export class DotIconComponent {
    @Input() name: string;
    @Input() invertColor: boolean;
    @Input() tiny: boolean;

    constructor() {}
}
