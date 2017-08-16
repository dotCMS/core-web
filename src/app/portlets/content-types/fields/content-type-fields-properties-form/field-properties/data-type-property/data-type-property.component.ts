import { Component, Input } from '@angular/core';
import { Field } from '../../../index';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'required-property',
    templateUrl: './data-type.component.html',
})
export class DataTypePropertyComponent {
    @Input() field: Field;
    group: FormGroup;

    constructor() {

    }

    ngOnInit(): void {
    }
}