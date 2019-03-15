import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, NgZone } from '@angular/core';
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
    @Input() variables: DotFieldVariable[] = [{ key: '', value: ''}];
    @Output() variablesEmitted = new EventEmitter<DotFieldVariable[]>();
    variables2: DotFieldVariable[] = [{ key: '', value: ''}];

    constructor(private ngZone: NgZone) {
    }

    ngOnInit() {

        console.log('--variables', this.variables);

    }

    ngOnChanges(change) {
        console.log('---change', change.variables.currentValue)
        // this.variables = change.variables.currentValue;

    }

    addVariable(variable: DotFieldVariable) {
        this.variables.push(variable);
        this.variablesEmitted.emit(this.variables);
    }

    deleteVariable(index: number) {
        this.ngZone.run(() => {
            this.variables.splice(index, 1);
        });
        this.variablesEmitted.emit(this.variables);
    }
}
