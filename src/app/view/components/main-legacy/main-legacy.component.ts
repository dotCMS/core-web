import {Component, OnDestroy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
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
    isTablet = false;
    private messages: any = {};
    private label = '';

    constructor(private dotEventsService: DotEventsService) {}

    ngOnInit(): void {
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';

        this.isTabletScreenOrLess();
    }

    /**
     * Set collapsed menu if window size is less than iPad landscape size
     * @memberof MainComponentLegacy
     */
    isTabletScreenOrLess(): void {
        if (window.innerWidth < 1025) {
            this.isTablet = true;
            this.isMenuCollapsed = true;
        }
    }

    /**
     * Set isTablet when resizing the window size
     * @param {any} event
     * @memberof MainComponentLegacy
     */
    @HostListener('window:resize', ['$event'])
        onResize(event: any) {
      event.target.innerWidth < 1025 ? this.isTablet = true : this.isTablet = false;
    }

    /**
     * Set icon based on the window width
     * @returns {string}
     * @memberof MainComponentLegacy
     */
    setIcon(): string {
        return window.innerWidth < 1025 ? 'fa-close' : 'fa-arrow-left';
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
        this.isTabletScreenOrLess();
    }
}
