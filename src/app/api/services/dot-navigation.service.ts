import { CoreWebService, DotcmsEventsService } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { RequestMethod } from '@angular/http';
import { DotRouterService } from './dot-router-service';
import { Subject } from 'rxjs/Subject';
import { Menu, MenuItem } from '../../shared/models/navigation';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class DotNavigationService {
    portletReload$ = new Subject();
    menu$: Observable<Menu[]>;

    private urlMenus = 'v1/CORE_WEB/menu';

    constructor(
        private coreWebService: CoreWebService,
        private dotRouterService: DotRouterService
    ) {}

    /**
     * Load and set menu from endpoint
     *
     * @returns {Observable<Menu[]>}
     * @memberof DotNavigationService
     */
    loadMenu(): Observable<Menu[]> {
        if (!this.menu$) {
            this.menu$ = this.coreWebService
                .requestView({
                    method: RequestMethod.Get,
                    url: this.urlMenus
                })
                .publishLast()
                .refCount()
                .pluck('entity')
                .map((menu: Menu[]) => this.formatMenuItems(menu));
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
    getIframeUrl(id: string): Observable<string> {
        return this.getMenuItems()
            .filter((res: any) => !res.angular && res.id === id)
            .first()
            .pluck('url');
    }

    /**
     * Check if a portlet exist in the current loaded menu
     *
     * @param {string} url
     * @returns {Observable<boolean>}
     * @memberof DotNavigationService
     */
    isPortletInMenu(url: string): Observable<boolean> {
        return this.getMenuItems()
            .pluck('id')
            .map((id: string) => url === id)
            .filter(val => !!val);
    }

    /**
     * Navigates to the first portlet in the menu
     *
     * @memberof DotNavigationService
     */
    goToFirstPortlet(): void {
        this.getFirstPortletLink().subscribe((firstPortletUrl: string) => {
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

    /**
     * Clear the "cache" in the menu and reloads
     *
     * @returns {Observable<Menu[]>}
     * @memberof DotNavigationService
     */
    reloadMenu(): Observable<Menu[]> {
        this.menu$ = null;
        return this.loadMenu();
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

    private getFirstPortletLink(): Observable<string> {
        return this.loadMenu().map((menus: Menu[]) => {
            const firstPortlet = menus[0].menuItems[0];
            return firstPortlet.menuLink || firstPortlet.url;
        });
    }

    private getMenuItems(): Observable<MenuItem> {
        return this.loadMenu()
            .flatMap((menus: Menu[]) => menus)
            .flatMap((menu: Menu) => menu.menuItems);
    }
}
