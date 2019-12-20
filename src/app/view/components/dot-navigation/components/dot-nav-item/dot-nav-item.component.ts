import {
    Component,
    Output,
    EventEmitter,
    Input,
    HostListener,
    OnInit,
    HostBinding,
    OnDestroy
} from '@angular/core';
import { DotMenu, DotMenuItem } from '@models/navigation';
import { IframeOverlayService } from '@components/_common/iframe/service/iframe-overlay.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DotEventsService } from '@services/dot-events/dot-events.service';

@Component({
    selector: 'dot-nav-item',
    templateUrl: './dot-nav-item.component.html',
    styleUrls: ['./dot-nav-item.component.scss']
})
export class DotNavItemComponent implements OnInit, OnDestroy {
    @Input() data: DotMenu;
    @Output()
    menuClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenu }> = new EventEmitter();
    @Output()
    itemClick: EventEmitter<{ originalEvent: MouseEvent; data: DotMenuItem }> = new EventEmitter();
    @HostBinding('class.dot-nav__item--contextmenu') contextmenu = false;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public iframeOverlayService: IframeOverlayService,
        private dotEventsService: DotEventsService
    ) {}

    ngOnInit() {
        this.iframeOverlayService.overlay
            .pipe(takeUntil(this.destroy$), filter((val: boolean) => !val))
            .subscribe((val: boolean) => (this.contextmenu = val));
        this.dotEventsService
            .listen('hide-sub-nav-fly-outs')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.contextmenu = false;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
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
        this.dotEventsService.notify('hide-sub-nav-fly-outs');
    }

    @HostListener('contextmenu', ['$event'])
    showSubMenuPanel(event: MouseEvent) {
        this.dotEventsService.notify('hide-sub-nav-fly-outs');
        event.preventDefault();
        this.iframeOverlayService.show();
        this.contextmenu = true;
    }

    @HostListener('document:click', ['$event'])
    handleClick(): void {
        this.contextmenu = false;
    }
}
