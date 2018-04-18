import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotLayoutSideBar } from '../../../shared/models/dot-layout-sidebar.model';

// TODO: Implement ControlValueAccessor instead of passing the formGroup
@Component({
    selector: 'dot-sidebar-properties',
    templateUrl: './dot-sidebar-properties.component.html',
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotSidebarPropertiesComponent)
        }
    ]
})
export class DotSidebarPropertiesComponent implements OnInit, ControlValueAccessor {
    value: DotLayoutSideBar;
    @ViewChild('overlay') overlay: any;

    constructor(private dotMessageService: DotMessageService) {}

    propagateChange = (_: any) => {};

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'editpage.layout.sidebar.width.small',
                'editpage.layout.sidebar.width.medium',
                'editpage.layout.sidebar.width.large',
                'editpage.layout.sidebar.action.open'
            ])
            .subscribe();
    }

    /**
     * Write a new value to the property item
     * @param {DotLayoutSideBar} value
     * @memberof DotSidebarPropertiesComponent
     */
    writeValue(value: DotLayoutSideBar): void {
        if (value) {
            this.value = value;
        }
    }

    /**
     * Set the function to be called when the control receives a change event
     * @param {any} fn
     * @memberof DotSidebarPropertiesComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
