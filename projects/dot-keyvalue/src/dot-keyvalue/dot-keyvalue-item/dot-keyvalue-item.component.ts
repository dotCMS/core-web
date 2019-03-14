import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { DotFieldVariable } from '@portlets/content-types/fields/dot-content-type-fields-variables/models/dot-field-variable.interface';

@Component({
    selector: 'dot-keyvalue-item',
    templateUrl: './dot-keyvalue-item.component.html',
    styleUrls: ['./dot-keyvalue-item.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
    // encapsulation: ViewEncapsulation.Native
})
export class DotKeyvalueItemComponent {
    @Input() labels;
    @Output()
    save: EventEmitter<DotFieldVariable> = new EventEmitter<DotFieldVariable>();

    fieldVariable: DotFieldVariable = {
        key: '',
        value: ''
    };

    constructor() {}

    onSubmit() {
        this.save.emit(Object.assign({}, this.fieldVariable));
        this.fieldVariable = {
            key: '',
            value: ''
        };
    }
}
