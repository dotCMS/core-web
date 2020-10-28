import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'dot-portlet-toolbar',
    templateUrl: './dot-portlet-toolbar.component.html',
    styleUrls: ['./dot-portlet-toolbar.component.scss']
})
export class DotPortletToolbarComponent implements OnInit {
    @Input() title: string;

    @Input() cancelButtonLabel: string;

    @Input() actionsButtonLabel: string;

    @Input() actions: {
        primary: MenuItem[];
        cancel: (event: MouseEvent) => void;
    };

    constructor() {}

    ngOnInit(): void {}

    /**
     * Hancdle cancel button click
     *
     * @param {MouseEvent} $event
     * @memberof DotPortletToolbarComponent
     */
    onCancelClick($event: MouseEvent): void {
        try {
            this.actions.cancel($event);
        } catch (error) {
            console.error(error);
        }
    }
}
