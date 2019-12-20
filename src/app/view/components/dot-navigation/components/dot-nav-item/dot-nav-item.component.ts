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
import {merge, Subject} from 'rxjs';
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
    @HostBinding('class.contextmenu') contextmenu = false;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public iframeOverlayService: IframeOverlayService,
        private dotEventsService: DotEventsService
    ) {}

    ngOnInit() {
        // this.iframeOverlayService.overlay
        //     .pipe(takeUntil(this.destroy$), filter((val: boolean) => !val && this.contextmenu))
        //     .subscribe((val: boolean) => {
        //         this.contextmenu = val;
        //         console.log('test2');
        //     });
        // this.dotEventsService
        //     .listen('hide-sub-nav-fly-outs')
        //     .pipe(takeUntil(this.destroy$), filter(() => this.contextmenu))
        //     .subscribe(() => {
        //         console.log('test');
        //         this.contextmenu = false;
        //         this.iframeOverlayService.hide();
        //     });

        this.setHideFlyOutSubscriptions();
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
        event.preventDefault();
        this.dotEventsService.notify('hide-sub-nav-fly-outs');
        this.iframeOverlayService.show();
        this.contextmenu = true;
    }

    @HostListener('document:click', ['$event'])
    handleClick(): void {
        this.contextmenu = false;
    }

    handleItemClick(event: { originalEvent: MouseEvent; data: DotMenuItem }) {
        this.itemClick.emit(event);
        this.dotEventsService.notify('hide-sub-nav-fly-outs');
    }

    private setHideFlyOutSubscriptions(): void {
        const hideFlyOut$ = merge(
            this.iframeOverlayService.overlay.pipe(filter((val: boolean) => !val)),
            this.dotEventsService.listen('hide-sub-nav-fly-outs')
        ).pipe(takeUntil(this.destroy$), filter(() => this.contextmenu));

        hideFlyOut$.subscribe(() => {
            this.contextmenu = false;
            this.iframeOverlayService.hide();
        });
    }
}
