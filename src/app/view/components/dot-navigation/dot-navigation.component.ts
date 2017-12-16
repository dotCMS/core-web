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
    @Output() onMenuLinkClicked = new EventEmitter<Event>();

    constructor(private dotNavigationService: DotNavigationService, private el: ElementRef) {}

    ngOnInit() {
        this.menu = this.dotNavigationService.items$;
    }

    /**
     * Respond to document events and collapse the sidenav if is clicked outside
     * TODO: not working on iframes
     * @param {*} event
     * @memberof DotNavigationComponent
     */
    @HostListener('document:click', ['$event'])
    handleClick(event: any) {
        if (!this.el.nativeElement.contains(event.target)) {
            if (event.target.className !== 'layout__sidebar' &&
                event.target.parentNode.parentNode.parentNode.className !== 'toolbar__button-wrapper') {
                this.onMenuLinkClicked.emit(event);
            }
        }
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
}
