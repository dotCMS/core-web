import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BubbleMenuItem, BubbleChangeDropdownComponent } from '@dotcms/block-editor';
import { DotMenuItem } from '../suggestions/suggestions.component';

@Component({
    selector: 'dotcms-bubble-menu',
    templateUrl: './bubble-menu.component.html',
    styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent {
    @Input() items: BubbleMenuItem[] = [];
    @Input() selected: DotMenuItem;
    @Output() command: EventEmitter<BubbleMenuItem> = new EventEmitter();
    @Output() toggleChangeTo: EventEmitter<void> = new EventEmitter();
    @ViewChild('dropdown', { static: true }) dropdown: BubbleChangeDropdownComponent;

    preventDeSelection(event: MouseEvent): void {
        event.preventDefault();
    }
}
