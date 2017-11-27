import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-layout-sidebar',
    templateUrl: './dot-layout-sidebar.component.html',
    styleUrls: ['./dot-layout-sidebar.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotLayoutSidebarComponent)
        }
    ]
})
export class DotLayoutSidebarComponent implements ControlValueAccessor {
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
