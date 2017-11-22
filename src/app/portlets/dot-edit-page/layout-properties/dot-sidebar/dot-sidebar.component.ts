import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef } from '@angular/core';
@Component({
    selector: 'dot-sidebar',
    templateUrl: './dot-sidebar.component.html',
    styleUrls: ['./dot-sidebar.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotSidebarComponent)
        }
    ]
})
export class DotSidebarComponent implements ControlValueAccessor {
    value: string;

    constructor() {}

    propagateChange = (_: any) => {};

    writeValue(value: string): void {
        if (value) {
            this.value = value;
        }
    }

    setValue(value: boolean): void {
        this.propagateChange(value);
    }

    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
 }
