import { Component, Input } from '@angular/core';

@Component({
    selector: 'required-property',
    template: `
        <p-checkbox
            [label]="propertyName"
            [value]="propertyValue"
            [formControlName]="propertyName"
            binary="true">
        </p-checkbox>
    `,
})
export class CheckboxPropertyComponent {
    @Input() propertyName: string;
    @Input() propertyValue: boolean;

    constructor() {

    }

    ngOnInit(): void {
    }
}