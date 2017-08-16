import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'hint-property',
    templateUrl: './hint-property.component.html',
})
export class HintPropertyComponent {
    group: FormGroup;

    constructor() {

    }

    ngOnInit(): void {
    }
}