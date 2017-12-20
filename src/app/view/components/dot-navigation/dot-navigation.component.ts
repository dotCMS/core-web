import { Component, ViewEncapsulation, OnInit, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotMenu } from '../../../shared/models/navigation';
import { DotNavigationService } from './dot-navigation.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./dot-navigation.component.scss'],
    templateUrl: 'dot-navigation.component.html'
})
export class DotNavigationComponent implements OnInit {
    menu: Observable<DotMenu[]>;
    @Output() menuLinkClicked = new EventEmitter<Event>();

    constructor(private dotNavigationService: DotNavigationService, public sideNavEl: ElementRef) {}

    ngOnInit() {
        this.menu = this.dotNavigationService.items$;
    }

    /**
     * Change or refresh the portlets
     *
     * @param {*} event click event
     * @param {string} id menu item id
     * @memberof MainNavigationComponent
     */
    onClick(event: MouseEvent, id: string): void {
        if (!event.ctrlKey && !event.metaKey) {
            this.menuLinkClicked.emit(event);
            this.dotNavigationService.reloadCurrentPortlet(id);
        }
    }

    /**
     * Check is the portlet in the nav is active.
     *
     * @param {string} id
     * @returns
     * @memberof DotNavigationComponent
     */
    isActive(id: string) {
        return this.dotNavigationService.isActive(id);
    }
}
