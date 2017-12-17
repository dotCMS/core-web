import {Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DotEventsService } from '../../../api/services/dot-events/dot-events.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-component',
    styleUrls: ['./main-legacy.component.scss'],
    templateUrl: './main-legacy.component.html'
})
export class MainComponentLegacy implements OnInit, OnDestroy {
    isMenuCollapsed = false;
    private messages: any = {};
    private label = '';

    constructor(private dotEventsService: DotEventsService) {}

    ngOnInit(): void {
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';

        this.isTabletScreenOrLess(window.screen.width);
    }

    isTabletScreenOrLess(screenWidth: number): void {
        if (screenWidth < 1025) {
            this.isMenuCollapsed = true;
        }
    }

    ngOnDestroy(): void {
        this.messages = null;
        this.label = null;
    }

    toggleSidenav(): void {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this.dotEventsService.notify('dot-side-nav-toggle');
    }

    onMenuLinkClicked($event: MouseEvent): void {
        $event.preventDefault();
        this.isTabletScreenOrLess(window.screen.width);
    }
}
