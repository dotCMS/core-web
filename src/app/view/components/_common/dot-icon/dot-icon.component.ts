import { Component, Input } from '@angular/core';

enum DotIconSize {
    normal = 18,
    small = 12,
    big = 24
}

/**
 * The DotIconComponent uses google material design icons
 * https://material.io/tools/icons
 * @export
 * @class DotIconComponent
 */
@Component({
    selector: 'dot-icon',
    styleUrls: ['./dot-icon.component.scss'],
    templateUrl: './dot-icon.component.html'
})
export class DotIconComponent {
    @Input() name: string;

    iconSize = DotIconSize.normal;

    constructor() {}

    @Input('size')
    set size(val: string) {
        this.iconSize = DotIconSize[val];
    }
}
