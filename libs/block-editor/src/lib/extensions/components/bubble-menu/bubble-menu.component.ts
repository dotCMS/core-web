import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BubbleMenuItem, SuggestionsComponent } from '@dotcms/block-editor';
import { DotMenuItem } from '../suggestions/suggestions.component';

@Component({
    selector: 'dotcms-bubble-menu',
    templateUrl: './bubble-menu.component.html',
    styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent {
    @Input() items: BubbleMenuItem[] = [];
    @Input() selected: string;
    @Output() command: EventEmitter<BubbleMenuItem> = new EventEmitter();

    // ChangeTo
    @Input() changeToItems: DotMenuItem[] = [];
    @Input() changeToIsShown: boolean;
    @Output() toggleChangeTo: EventEmitter<void> = new EventEmitter();
    @ViewChild('changeTo', { static: true }) changeTo: SuggestionsComponent;

    preventDeSelection(event: MouseEvent): void {
        event.preventDefault();
    }
}
