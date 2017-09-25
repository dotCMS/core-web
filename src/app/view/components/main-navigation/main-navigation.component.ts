import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DotNavigationService } from '../../../api/services/dot-navigation.service';
import { Observable } from 'rxjs/Observable';
import { Menu } from '../../../shared/models/navigation';
import { DotRouterService } from '../../../api/services/dot-router-service';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./main-navigation.component.scss'],
    templateUrl: 'main-navigation.component.html'
})

export class MainNavigationComponent implements OnInit {
    menuItems: Observable<Menu[]>;

    constructor(
        private dotNavigationService: DotNavigationService,
        private dotRouterService: DotRouterService
    ) {}

    ngOnInit() {
        // TOOD: remove the .subcribe
        this.menuItems = this.dotNavigationService.loadMenu();
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
