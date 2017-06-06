import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * The ActionButtonComponent is a configurable button with
 * options to add to the primary actions in the portlets.
 * @export
 * @class ActionButtonComponent
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'action-button',
    styles: [require('./action-button.component.scss')],
    templateUrl: 'action-button.component.html'
})

export class ActionButtonComponent {
    @Input() options: MenuItem[];
    @Input() primaryAction: Function;
}

export interface MenuItem {
    label: String;
    icon: String;
    command: Function;
    url: String;
    routerLink: any[];
}