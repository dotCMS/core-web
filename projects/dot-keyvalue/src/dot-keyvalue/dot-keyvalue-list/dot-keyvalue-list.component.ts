import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { DotFieldVariable } from '@portlets/content-types/fields/dot-content-type-fields-variables/models/dot-field-variable.interface';

@Component({
    selector: 'dot-keyvalue-list',
    templateUrl: './dot-keyvalue-list.component.html',
    styleUrls: ['./dot-keyvalue-list.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
    // encapsulation: ViewEncapsulation.Native
})
export class DotKeyvalueListComponent {
    @Input() variables: DotFieldVariable[];
    @Output() delete = new EventEmitter<number>();

    constructor() {}

    deleteVariable(index: number) {
        this.delete.emit(index);
    }
}
