import { DotGlobal } from './../layout-properties.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
@Component({
    selector: 'dot-page-layout-prop-item',
    templateUrl: './dot-list-item.component.html',
    styleUrls: ['./dot-list-item.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotListItemComponent)
        }
    ]
})
export class DotListItemComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() icon: string;
    @Output() change: EventEmitter<any> = new EventEmitter();

    value: boolean;

    constructor() {}

    propagateChange = (_: any) => {};

    writeValue(value: boolean): void {
        if (value) {
            this.value = value;
        }
    }

    setValue(value: boolean): void {
        this.value = value;
        this.propagateChange(value);
    }

    registerOnChange(fn): void {
        this.change.emit();
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
