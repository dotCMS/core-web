import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DotNavigationService } from '../../../api/services/dot-navigation.service';
import { Observable } from 'rxjs/Observable';
import { Menu } from '../../../shared/models/navigation';
import { DotRouterService } from '../../../api/services/dot-router-service';
import { DotcmsEventsService } from 'dotcms-js/dotcms-js';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./main-navigation.component.scss'],
    templateUrl: 'main-navigation.component.html'
})

export class MainNavigationComponent implements OnInit {
    menu: Observable<Menu[]>;

    constructor(
        private dotNavigationService: DotNavigationService,
        private dotRouterService: DotRouterService,
        private dotcmsEventsService: DotcmsEventsService,
    ) {}

    ngOnInit() {
        this.menu = this.dotNavigationService.loadMenu();

        this.dotcmsEventsService.subscribeTo('UPDATE_PORTLET_LAYOUTS').subscribe(() => {
            this.menu = this.dotNavigationService.reloadMenu();
        });
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
            this.dotNavigationService.reloadCurrentPortlet(id);
        }
    }

    /**
     * Check if menu option is active
     *
     * @param {string} id
     * @returns {boolean}
     * @memberof MainNavigationComponent
     */
    isActive(id: string): boolean {
        return this.dotRouterService.currentPortlet.id === id;
    }
}
