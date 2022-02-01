import { Component, OnInit, ViewChild, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DotEventsService } from '@services/dot-events/dot-events.service';
import { DotLayoutSideBar } from '@models/dot-edit-layout-designer';

@Component({
    selector: 'dot-sidebar-properties',
    templateUrl: './dot-sidebar-properties.component.html',
    styleUrls: ['./dot-sidebar-properties.component.scss'],
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
    @ViewChild('overlay', { static: true }) overlay: any;
    @Output() change: EventEmitter<string> = new EventEmitter();

    constructor(private dotEventsService: DotEventsService) {}

    propagateChange = (_: any) => {};

    ngOnInit() {
        this.value = {
            containers: [],
            location: '',
            width: ''
        };
    }

    /**
     * Hides overlay panel and emits a notification to repainted the Grid
     *
     * @memberof DotSidebarPropertiesComponent
     */
    changeSidebarSize(): void {
        this.overlay.hide();
        this.dotEventsService.notify('layout-sidebar-change');
        this.change.emit();
    }

    /**
     * Write a new value to the property item
     * @param DotLayoutSideBar value
     * @memberof DotSidebarPropertiesComponent
     */
    writeValue(value: DotLayoutSideBar): void {
        if (value) {
            this.value = value;
        }
    }

    /**
     * Set the function to be called when the control receives a change event
     * @param any fn
     * @memberof DotSidebarPropertiesComponent
     */
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}
}
