import { CoreWebService, DotcmsEventsService } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestMethod } from '@angular/http';
import { DotRouterService } from './dot-router-service';
import { Subject } from 'rxjs/Subject';
import { Menu } from '../../shared/models/navigation';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DotNavigationService {
    portletReload$ = new Subject();
    menu$: Observable<Menu[]>;

    private urlMenus = 'v1/CORE_WEB/menu';

    constructor(
        dotcmsEventsService: DotcmsEventsService,
        private coreWebService: CoreWebService,
        private dotRouterService: DotRouterService
    ) {
        // dotcmsEventsService.subscribeTo('UPDATE_PORTLET_LAYOUTS').subscribe(() => {
        //     this.loadMenu();
        // });
    }

    /**
     * Load and set menu from endpoint
     *
     * @returns {Observable<Menu[]>}
     * @memberof DotNavigationService
     */
    loadMenu(): Observable<Menu[]> {
        debugger;
        if (!this.menu$) {
            debugger;
            this.menu$ = this.coreWebService
                .requestView({
                    method: RequestMethod.Get,
                    url: this.urlMenus
                })
                .pluck('entity')
                .map((menu: Menu[]) => this.formatMenuItems(menu))
                // .share();
                .publishLast()
                .refCount();
        }

        return this.menu$;
    }

    /**
     * Get the url for the iframe porlet from the menu object
     *
     * @param {string} id
     * @returns {Observable<string>}
     * @memberof DotNavigationService
     */
    getPortletURL(id: string): Observable<string> {
        debugger;
        return this.loadMenu()
            .flatMap((menus: Menu[]) => menus)
            .flatMap((menu: Menu) => menu.menuItems)
            .filter((res: any) => {
                const a = !res.angular && res.id === id;
                debugger;
                return a;
            })
            .first()
            .pluck('url');
    }

    isPortletInMenu(url: string): Observable<boolean> {
        debugger;
        return this.loadMenu()
            .flatMap((menus: Menu[]) => menus)
            .flatMap((menu: Menu) => menu.menuItems)
            .pluck('id')
            .map((id: string) => {
                return url === id;
            })
            .filter(val => !!val);
    }

    /**
     * Navigates to the first portlet in the menu
     *
     * @memberof DotNavigationService
     */
    goToFirstPortlet(): void {
        debugger;
        this.getFirstPortletUrl().subscribe((firstPortletUrl: string) => {
            debugger;
            this.dotRouterService.gotoPortlet(firstPortletUrl);
        });
    }

    /**
     * Reload the current iframe portlet
     *
     * @param {string} id
     * @memberof DotNavigationService
     */
    reloadCurrentPortlet(id: string): void {
        if (id === this.dotRouterService.currentPortlet.id) {
            this.portletReload$.next();
        }
    }

    private getFirstPortletUrl(): Observable<string> {
        debugger;
        return this.loadMenu().map((menus: Menu[]) => menus[0].menuItems[0].menuLink);
    }

    private formatMenuItems(menu: Menu[]): Menu[] {
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
}
