import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DotMenu, DotMenuItem } from '@models/navigation';

@Component({
    selector: 'dot-nav-item',
    templateUrl: './dot-nav-item.component.html',
    styleUrls: ['./dot-nav-item.component.scss']
})



export class DotNavItemComponent {
    @Input()
    data: DotMenu;
    
    @Output()
    menuClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();

    @Output()
    rightClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();

    @Output()
    itemClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenuItem }> = new EventEmitter();

    @Output()
    menuHover: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();

    @Output()
    menuOut: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();

    constructor() {}


    /**
     * Handle click on menu section title
     *
     * @param MouseEvent $event
     * @param DotMenu data
     * @memberof DotNavItemComponent
     */
    clickHandler($event: MouseEvent, data: DotMenu): void {

        this.menuClick.emit({
            originalEvent: $event,
            data: data
        });
    }

    /**
     * Handle click on menu section title
     *
     * @param MouseEvent $event
     * @param DotMenu data
     * @memberof DotNavItemComponent
     */
    onMouseOver($event: MouseEvent, data: DotMenu): void {
        this.menuHover.emit({
            originalEvent: $event,
            data: data
        });
    }
    /**
     * Handle click on menu section title
     *
     * @param MouseEvent $event
     * @param DotMenu data
     * @memberof DotNavItemComponent
     */
    onMouseOut($event: MouseEvent, data: DotMenu): void {
        this.menuOut.emit({
            originalEvent: $event,
            data: data
        });
    }

    onRightClick($event: MouseEvent, data: DotMenu): boolean {

        $event.stopPropagation;
        this.rightClick.emit({
            originalEvent: $event,
            data: data
        });
        return false;
    }



}
