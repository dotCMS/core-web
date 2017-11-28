import { DotLayoutPropertiesItemComponent } from './../dot-layout-properties-item/dot-layout-properties-item.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { Component, forwardRef, ViewEncapsulation, Input, group, ViewChild } from '@angular/core';

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
    @ViewChild('propertyItemLeft') propertyItemLeft: DotLayoutPropertiesItemComponent;
    @ViewChild('propertyItemRight') propertyItemRight: DotLayoutPropertiesItemComponent;
    value: {};

    constructor() {}

    propagateChange = (_: any) => {};

    writeValue(value): void {
        if (value) {
            this.value = value;
        }
    }

    setValue(value: boolean, location: string): void {
        if (value && location === 'left') {
            this.propertyItemLeft.setChecked();
            this.propertyItemRight.setUnchecked();
        }

        if (value && location === 'right') {
            this.propertyItemLeft.setUnchecked();
            this.propertyItemRight.setChecked();
        }

        this.value = value ? { location: location } : {};
        this.propagateChange(this.value);
    }

    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
 }
