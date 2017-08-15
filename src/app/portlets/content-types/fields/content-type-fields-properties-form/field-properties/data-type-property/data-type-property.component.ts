import { Component, Input } from '@angular/core';
import { Field } from '../../../index';

@Component({
    selector: 'required-property',
    templateUrl: './data-type.component.html',
})
export class DataTypePropertyComponent {
    @Input() field: Field;

    constructor() {

    }

    ngOnInit(): void {
    }
}