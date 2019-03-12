import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DotFieldVariable } from '@portlets/content-types/fields/dot-content-type-fields-variables/models/dot-field-variable.interface';

@Component({
    selector: 'dot-keyvalue-item',
    templateUrl: './dot-keyvalue-item.component.html',
    styleUrls: ['./dot-keyvalue-item.component.scss'],
    // encapsulation: ViewEncapsulation.Native
    encapsulation: ViewEncapsulation.Emulated
})
export class DotKeyvalueItemComponent implements OnInit {
    @Input()
    fieldVariable: DotFieldVariable;
    @Input()
    variableIndex: number;
    @Input()
    labels;

    rowActiveHighlight: Boolean = false;
    showEditMenu: Boolean = false;

    constructor() {
        console.log('--- preitem', this.fieldVariable);
    }

    ngOnInit() {
        console.log('---item', this.fieldVariable);
    }
}
