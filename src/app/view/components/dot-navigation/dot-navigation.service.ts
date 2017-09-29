import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotMenu } from '../../../shared/models/navigation/menu.model';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { DotRouterService } from '../../../api/services/dot-router-service';
import { Subject } from 'rxjs/Subject';
import { LoginService } from 'dotcms-js/dotcms-js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DotcmsEventsService } from 'dotcms-js/core/dotcms-events.service';
import { Auth } from 'dotcms-js/core/login.service';

@Injectable()
export class DotNavigationService {
    items$: BehaviorSubject<DotMenu[]> = new BehaviorSubject([]);

    constructor(
        private dotMenuService: DotMenuService,
        private dotRouterService: DotRouterService,
        private dotcmsEventsService: DotcmsEventsService,
        private loginService: LoginService
    ) {
        this.getNavigation().subscribe((menu: DotMenu[]) => {
            this.setMenu(menu);
        });

        this.dotcmsEventsService.subscribeTo('UPDATE_PORTLET_LAYOUTS').subscribe(() => {
            this.reloadNavigation();
        });

        /*
            When the page reload the auth$ triggers for the "first time" and because of that
            on page reload we are doing 2 requests to menu enpoint.
        */
        this.loginService.auth$.subscribe((auth: Auth) => {
            if (auth.loginAsUser || auth.user) {
                this.reloadNavigation();
            }
        });
    }

    /**
     * Navigates to the first portlet
     *
     * @memberof DotNavigationService
     */
    goToFirstPortlet(): void {
        this.getFirstMenuLink().subscribe((link: string) => {
            this.dotRouterService.gotoPortlet(link);
        });
    }

    /**
     * Get menu and formatted as navigation component requirements
     *
     * @returns {Observable<DotMenu[]>}
     * @memberof DotNavigationService
     */
    getNavigation(): Observable<DotMenu[]> {
        return this.dotMenuService.loadMenu().map((menu: DotMenu[]) => this.formatMenuItems(menu));
    }

    /**
     * Reloads and return a new version of the menu
     *
     * @returns {Observable<DotMenu[]>}
     * @memberof DotNavigationService
     */
    reloadNavigation(): void {
        this.dotMenuService
            .reloadMenu()
            .map((menu: DotMenu[]) => this.formatMenuItems(menu))
            .subscribe((menu: DotMenu[]) => {
                this.setMenu(menu);
                // this.dotRouterService.gotoPortlet(this.dotRouterService.currentPortlet.id);
                debugger;
            });
    }

    /**
     * Check if menu option is active
     *
     * @param {string} id
     * @returns {boolean}
     * @memberof DotNavigationService
     */
    isActive(id: string): boolean {
        return this.dotRouterService.currentPortlet.id === id;
    }

    /**
     * Reload current portlet
     *
     * @param {string} id
     * @memberof DotNavigationService
     */
    reloadCurrentPortlet(id: string): void {
        this.dotRouterService.reloadCurrentPortlet(id);
    }

    private extractFirtsMenuLink(menus: DotMenu[]): string {
        return menus[0].menuItems[0].menuLink || menus[0].menuItems[0].url;
    }

    private formatMenuItems(menu: DotMenu[]): DotMenu[] {
        return menu.map(menuGroup => {
            menuGroup.menuItems.forEach(menuItem => {
                if (!menuItem.angular) {
                    menuItem.menuLink = `/c/${menuItem.id}`;
                }
                if (menuItem.id === this.dotRouterService.currentPortlet.id) {
                    menuGroup.isOpen = true;
                }
            });
            return menuGroup;
        });
    }

    private getFirstMenuLink(): Observable<string> {
        return this.getNavigation()
            .map((menu: DotMenu[]) => this.formatMenuItems(menu))
            .map((menus: DotMenu[]) => this.extractFirtsMenuLink(menus));
    }

    private setMenu(menu: DotMenu[]) {
        this.items$.next(menu);
    }
}
