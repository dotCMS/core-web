import { Component, ViewEncapsulation, OnInit, Output, EventEmitter, ElementRef, HostListener, Input } from '@angular/core';
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
    @Output() onMenuLinkClicked = new EventEmitter<Event>();

    constructor(private dotNavigationService: DotNavigationService, private sideNavEl: ElementRef) {}

    ngOnInit() {
        this.menu = this.dotNavigationService.items$;
    }

    /**
     * Respond to document events and collapse the sidenav if is clicked outside
     * @param {*} event
     * @memberof DotNavigationComponent
     */
    @HostListener('document:click', ['$event'])
    onClickOutside(event: any) {
        const eTarget = event.target;

        // tslint:disable-next-line:max-line-length
        this.isClickedOutsideSidenav(eTarget, eTarget.className !== 'layout__sidebar' && eTarget.className.split(' ')[0] !== 'ui-button-icon-left');
    }

    /**
     * Change or refresh the portlets
     *
     * @param {*} event click event
     * @param {string} id menu item id
     * @memberof MainNavigationComponent
     */
    onClick(event: any, id: string): void {
        if (!event.ctrlKey && !event.metaKey) {
            this.onMenuLinkClicked.emit(event);
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

    private isClickedOutsideSidenav(eventTarget: MouseEvent, isSafeToCollapse: boolean): void {
        if (!this.sideNavEl.nativeElement.contains(eventTarget) && isSafeToCollapse) {
                this.onMenuLinkClicked.emit(event);
        }
    }
}
