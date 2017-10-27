import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

/**
 * The ActionButtonComponent is a configurable button with
 * options to add to the primary actions in the portlets.
 * @export
 * @class ActionMenuButtonComponent
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'action-menu-button',
    styleUrls: ['./action-menu-button.component.scss'],
    templateUrl: 'action-menu-button.component.html'
})

export class ActionMenuButtonComponent {
    @Input() model?: MenuItem[];
    @Input() command?: ($event) => void;
    @Input() label: string;
    @Input() eventRow: any;
}
