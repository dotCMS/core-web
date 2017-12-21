import { DotNavigationComponent } from './../dot-navigation/dot-navigation.component';
import {Component, OnDestroy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { DotEventsService } from '../../../api/services/dot-events/dot-events.service';
import { Router } from '@angular/router';

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

    constructor(private dotEventsService: DotEventsService, private router: Router) {}

    ngOnInit(): void {
        document.body.style.backgroundColor = '';
        document.body.style.backgroundImage = '';

        this.router.events.subscribe(event => this.isTabletScreenOrLess());

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
        this.isTablet = event.target.innerWidth < 1025;
    }

    /**
     * Respond to document events and collapse the sidenav if is clicked outside
     * @param {*} event
     * @memberof DotNavigationComponent
     */
    @HostListener('document:click', ['$event'])
    onClickOutside(event: any) {
        this.isMenuCollapsed = true;
    }

    ngOnDestroy(): void {
        this.messages = null;
        this.label = null;
    }

    toggleSidenav(): void {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this.dotEventsService.notify('dot-side-nav-toggle');
    }
}
