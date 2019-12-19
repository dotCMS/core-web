import {Component, Output, EventEmitter, Input, HostListener, OnInit, HostBinding} from '@angular/core';
import { DotMenu, DotMenuItem } from '@models/navigation';
import { IframeOverlayService } from '@components/_common/iframe/service/iframe-overlay.service';


@Component({
    selector: 'dot-nav-item',
    templateUrl: './dot-nav-item.component.html',
    styleUrls: ['./dot-nav-item.component.scss']
})
export class DotNavItemComponent implements OnInit {
    @Input() data: DotMenu;
    @Output()
    menuClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();
    @Output()
    itemClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenuItem }> = new EventEmitter();
    @HostBinding('class.dot-nav__item--contextmenu') contextmenu = false;
    showOverlay = false;
    constructor(public iframeOverlayService: IframeOverlayService) {}

    ngOnInit() {
        this.iframeOverlayService.overlay
          //  .pipe(takeUntil(this.destroy$))
            .subscribe((val: boolean) => (this.showOverlay = val));
    }

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

    @HostListener('contextmenu', ['$event'])
    showSubMenuPanel(event: MouseEvent) {
        event.preventDefault();
        this.contextmenu = true;
        this.showOverlay = true;
    }

    hideSubNav(): void {
        this.contextmenu = false;
        this.showOverlay = false;
        console.log('hideSubNav');
    }

}
