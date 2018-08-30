import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DotMenu, DotMenuItem } from '../../../../../shared/models/navigation';

@Component({
    selector: 'dot-nav-item',
    templateUrl: './dot-nav-item.component.html',
    styleUrls: ['./dot-nav-item.component.scss']
})
export class DotNavItemComponent implements OnInit {
    @Input() data: DotMenu;
    @Output() menuClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();
    @Output() itemClick: EventEmitter<{ originalEvent: MouseEvent, data: DotMenuItem }> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    clickHandler($event, data): void {
        this.menuClick.emit({
            originalEvent: $event,
            data: data
        });
    }
}
