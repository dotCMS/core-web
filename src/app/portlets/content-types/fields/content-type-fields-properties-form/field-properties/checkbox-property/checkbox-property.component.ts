import { Component, Input } from '@angular/core';

@Component({
    selector: 'required-property',
    template: `
        <div class="form__group" [formGroup]="group">
            <p-checkbox
                [label]="propertyName"
                [value]="propertyValue"
                [formControlName]="propertyName"
                binary="true">
            </p-checkbox>
        </div>
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