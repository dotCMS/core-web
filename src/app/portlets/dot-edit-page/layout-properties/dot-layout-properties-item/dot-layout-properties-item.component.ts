import { DotLayoutSidebarComponent } from './../dot-layout-sidebar/dot-layout-sidebar.component';
import { DotGlobal } from './../layout-properties.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'dot-layout-properties-item',
    templateUrl: './dot-layout-properties-item.component.html',
    styleUrls: ['./dot-layout-properties-item.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotLayoutPropertiesItemComponent)
        }
    ]
})
export class DotLayoutPropertiesItemComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() icon: string;
    @Output() change: EventEmitter<boolean> = new EventEmitter();

    value: boolean;

    constructor() {}

    propagateChange = (_: any) => {};

    writeValue(value: boolean): void {
        if (value) {
            this.value = value;
        }
    }

    @HostListener('click', ['$event'])
    onClick() {
        this.value = !this.value;
        this.propagateChange(this.value);
        this.change.emit(this.value);
    }

    setChecked() {
        this.value = true;
    }

    setUnchecked() {
        this.value = false;
    }

    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
