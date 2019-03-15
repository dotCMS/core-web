import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
    selector: 'dot-test',
    templateUrl: './dot-test.component.html',
    // encapsulation: ViewEncapsulation.Native
    encapsulation: ViewEncapsulation.Emulated
})
export class DotTestComponent {
    @Input() labels;

    constructor() {
    }

}
