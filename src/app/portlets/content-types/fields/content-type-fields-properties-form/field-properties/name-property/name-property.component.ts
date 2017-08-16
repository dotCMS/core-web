import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms/forms';

@Component({
    selector: 'name-property',
    templateUrl: './name-property.component.html',
})
export class NamePropertyComponent {
    group: FormGroup;

    constructor() {

    }

    ngOnInit(): void {
    }
}