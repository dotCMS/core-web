import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DotFieldVariable } from '@portlets/content-types/fields/dot-content-type-fields-variables/models/dot-field-variable.interface';

@Component({
    selector: 'dot-keyvalue',
    templateUrl: './dot-keyvalue.component.html',
    styleUrls: ['./dot-keyvalue.component.scss'],
    // encapsulation: ViewEncapsulation.Native
    encapsulation: ViewEncapsulation.Emulated
})
export class DotKeyvalueComponent implements OnInit, OnChanges {
    @Input() labels;
    @Input() variables: DotFieldVariable[];
    @Output() action = new EventEmitter<string>();

    cars = [
        { brand: 'VW', year: 2012, color: 'Orange', vin: 'dsad231ff' },
        { brand: 'Audi', year: 2011, color: 'Black', vin: 'gwregre345' },
        { brand: 'Renault', year: 2005, color: 'Gray', vin: 'h354htr' }
    ];

    constructor() {}

    ngOnInit() {
        console.log('***variables', this.variables)

    }

    ngOnChanges(change): void {
       console.log('***changes', change)
    }

    handleClick() {
        console.log('--click', typeof this.variables);
        this.action.emit(`value: ${this.variables[0].value}`);
    }
}
