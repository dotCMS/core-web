import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { Observable, BehaviorSubject, combineLatest, Subject, merge } from 'rxjs';
import { filter, switchMap, map, tap, take } from 'rxjs/operators';

import { Auth } from '@dotcms/dotcms-js';
import { DotcmsEventsService, LoginService } from '@dotcms/dotcms-js';

import { DotMenu, DotMenuItem } from '@models/navigation';
import { DotMenuService } from '@services/dot-menu.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotIframeService } from '../../_common/iframe/service/dot-iframe/dot-iframe.service';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import { DotLocalstorageService } from '@services/dot-localstorage/dot-localstorage.service';
import { Title } from '@angular/platform-browser';

export const replaceSectionsMap = {
    'edit-page': 'site-browser'
};

const replaceIdForNonMenuSection = (id) => {
    return replaceSectionsMap[id];
};

interface DotActiveItemsProps {
    url: string;
    collapsed: boolean;
    menuId?: string;
    previousUrl: string;
}

interface DotActiveItemsFromParentProps extends DotActiveItemsProps {
    menus: DotMenu[];
}

function getActiveMenuFromMenuId({ menus, menuId, collapsed, url }: DotActiveItemsFromParentProps) {
    return menus.map((menu) => {
        menu.active = false;

        menu.menuItems = menu.menuItems.map((item) => ({
            ...item,
            active: false
        }));

        if (menu.id === menuId) {
            menu.active = true;
            menu.isOpen = !collapsed && menu.active; // TODO: this menu.active what?
            menu.menuItems = menu.menuItems.map((item) => ({
                ...item,
                active: item.id === url
            }));
        }

        return menu;
    });
}

function isDetailPage(id: string, url: string): boolean {
    return url.split('/').includes('edit') && url.includes(id);
}

function isMenuActive(menus: DotMenu[]): boolean {
    return !!menus.find((item) => item.active);
}

function isEditPageFromSiteBrowser(menuId: string, previousUrl: string): boolean {
    return menuId === 'edit-page' && previousUrl === '/c/site-browser';
}

const setActiveItems =
    ({ url, collapsed, menuId, previousUrl }: DotActiveItemsProps) =>
    (source: Observable<DotMenu[]>) => {
        console.log('======== setactive', url, collapsed, menuId, previousUrl);
        let urlId = getTheUrlId(url);
        return source.pipe(
            url
                ? map((m: DotMenu[]) => {
                      console.log('======== menu', m, url, menuId);
                      const menus: DotMenu[] = [...m];
                      let isActive = false;
                      console.log('##### llego0');

                      if (
                          isEditPageFromSiteBrowser(menuId, previousUrl) ||
                          (isDetailPage(urlId, url) && isMenuActive(menus))
                      ) {
                          return null;
                      }
                      console.log('##### llego1');

                      // TODO: make it more specific
                      // When user browse using the navigation (Angular Routing)
                      if (menuId && menuId !== 'edit-page') {
                          return getActiveMenuFromMenuId({
                              menus,
                              menuId,
                              collapsed,
                              url: urlId,
                              previousUrl
                          });
                      }

                      // When user browse using the browser url bar, direct links or reload page
                      urlId = replaceIdForNonMenuSection(urlId) || urlId;
                      console.log('##### llego2');
                      for (let i = 0; i < menus.length; i++) {
                          menus[i].active = false;
                          menus[i].isOpen = false;

                          for (let k = 0; k < menus[i].menuItems.length; k++) {
                              // Once we activate the first one all the others are close
                              if (isActive) {
                                  menus[i].menuItems[k].active = false;
                              }

                              if (!isActive && menus[i].menuItems[k].id === urlId) {
                                  isActive = true;
                                  menus[i].active = true;
                                  menus[i].isOpen = true;
                                  menus[i].menuItems[k].active = true;
                              }
                          }
                      }
                      debugger;
                      console.log('##### llego3', menus);
                      return menus;
                  })
                : tap((m) => m)
        );
    };

const DOTCMS_MENU_STATUS = 'dotcms.menu.status';

function getTheUrlId(url: string): string {
    const urlSegments: string[] = url.split('/').filter(Boolean);
    return urlSegments[0] === 'c' ? urlSegments.pop() : urlSegments[0];
}

@Injectable()
export class DotNavigationService {
    private _collapsed$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _items$: BehaviorSubject<DotMenu[]> = new BehaviorSubject([]);
    private _appMainTitle: string;

    setActiveMenu$: Subject<unknown> = new Subject();

    constructor(
        private dotEventsService: DotEventsService,
        private dotIframeService: DotIframeService,
        private dotMenuService: DotMenuService,
        private dotRouterService: DotRouterService,
        private dotcmsEventsService: DotcmsEventsService,
        private loginService: LoginService,
        private router: Router,
        private dotLocalstorageService: DotLocalstorageService,
        private titleService: Title
    ) {
        this._appMainTitle = this.titleService.getTitle();
        const savedMenuStatus = this.dotLocalstorageService.getItem<boolean>(DOTCMS_MENU_STATUS);
        this._collapsed$.next(savedMenuStatus === false ? false : true);

        this.dotMenuService.loadMenu().subscribe((menus: DotMenu[]) => {
            this.setMenu(menus);
        });

        merge(this.onNavigationEnd(), this.setActiveMenu$.asObservable()).subscribe((data) => {
            console.log('==== map', data);
            // debugger;
            if (data['url']) {
                this.dotMenuService
                    .loadMenu()
                    .pipe(
                        tap((menu: DotMenu[]) => {
                            const pageTitle = this.getPageCurrentTitle(data['url'], menu);
                            this.titleService.setTitle(
                                `${pageTitle ? pageTitle + ' - ' : ''} ${this._appMainTitle}`
                            );
                            return menu;
                        })
                        // setActiveItems({
                        //     url: data['url'],
                        //     collapsed: data['collapsed'] || this._collapsed$.getValue(),
                        //     menuId:
                        //         data['menuId'] ||
                        //         this.router.getCurrentNavigation().extras.state?.menuId,
                        //     previousUrl: data['previousUrl'] || this.dotRouterService.previousUrl
                        // }),
                        // filter((menu) => !!menu)
                    )
                    .subscribe((menu) => {
                        console.log('==== merge final menu', menu);
                        this.setMenu(menu);
                    });
            }
            //     ? this.dotMenuService
            //           .loadMenu()
            //           .pipe(
            //               tap((menu: DotMenu[]) => {
            //                   console.log('**** menu', menu);
            //                   // debugger;
            //                   const pageTitle = this.getPageCurrentTitle(event.url, menu);
            //                   this.titleService.setTitle(
            //                       `${pageTitle ? pageTitle + ' - ' : ''} ${
            //                           this._appMainTitle
            //                       }`
            //                   );
            //                   return menu;
            //               }),
            //               setActiveItems({
            //                   url: activateMenu['url'] || event.url,
            //                   collapsed:
            //                       activateMenu['collapsed'] || this._collapsed$.getValue(),
            //                   menuId:
            //                       activateMenu['menuId'] ||
            //                       this.router.getCurrentNavigation().extras.state?.menuId,
            //                   previousUrl:
            //                       activateMenu['previousUrl'] ||
            //                       this.dotRouterService.previousUrl
            //               }),
            //               filter((menu) => !!menu)
            //           )
            //           .subscribe((menu) => {
            //               // debugger;
            //               this.setMenu(menu);
            //           })
            //     : null;
        });
        // combineLatest([this.onNavigationEnd(), this.setActiveMenu$])
        //     .pipe(
        //         map(([event, activateMenu]: [NavigationEnd, unknown]) => {
        //             console.log('==== map', event, activateMenu);
        //             debugger;
        //             return event.url || activateMenu['url']
        //                 ? this.dotMenuService
        //                       .loadMenu()
        //                       .pipe(
        //                           tap((menu: DotMenu[]) => {
        //                               console.log('**** menu', menu);
        //                               // debugger;
        //                               const pageTitle = this.getPageCurrentTitle(event.url, menu);
        //                               this.titleService.setTitle(
        //                                   `${pageTitle ? pageTitle + ' - ' : ''} ${
        //                                       this._appMainTitle
        //                                   }`
        //                               );
        //                               return menu;
        //                           }),
        //                           setActiveItems({
        //                               url: activateMenu['url'] || event.url,
        //                               collapsed:
        //                                   activateMenu['collapsed'] || this._collapsed$.getValue(),
        //                               menuId:
        //                                   activateMenu['menuId'] ||
        //                                   this.router.getCurrentNavigation().extras.state?.menuId,
        //                               previousUrl:
        //                                   activateMenu['previousUrl'] ||
        //                                   this.dotRouterService.previousUrl
        //                           }),
        //                           filter((menu) => !!menu)
        //                       )
        //                       .subscribe((menu) => {
        //                           // debugger;
        //                           this.setMenu(menu);
        //                       })
        //                 : null;
        //         })
        //     )
        //     .subscribe();

        // this.setActiveMenu$.next('');

        // this.onNavigationEnd()
        //     .pipe(
        //         switchMap((event: NavigationEnd) => {
        //             return this.dotMenuService.loadMenu().pipe(
        //                 tap((menu: DotMenu[]) => {
        //                     const pageTitle = this.getPageCurrentTitle(event.url, menu);
        //                     this.titleService.setTitle(
        //                         `${pageTitle ? pageTitle + ' - ' : ''} ${this._appMainTitle}`
        //                     );
        //                     return menu;
        //                 }),
        //                 setActiveItems({
        //                     url: event.url,
        //                     collapsed: this._collapsed$.getValue(),
        //                     menuId: this.router.getCurrentNavigation().extras.state?.menuId,
        //                     previousUrl: this.dotRouterService.previousUrl
        //                 })
        //             );
        //         }),
        //         filter((menu) => !!menu)
        //     )
        //     .subscribe((menus: DotMenu[]) => {
        //         this.setMenu(menus);
        //     });

        this.dotcmsEventsService
            .subscribeTo('UPDATE_PORTLET_LAYOUTS')
            .subscribe((data: string[]) => {
                console.log('===UPDATE_PORTLET_LAYOUTS', data);
                this.reloadNavigation()
                    .pipe(
                        take(1),
                        setActiveItems({
                            url: data.length ? data[1][data[1].length - 1] : '',
                            collapsed: null,
                            menuId: data.length ? data[0]['id'] : '',
                            previousUrl: ''
                        })
                        // tap((menus: DotMenu[]) => {
                        // console.log('@@@@@@@@ tap', menus);
                        // this.setMenu(menus);
                        // })
                    )
                    .subscribe((menus: DotMenu[]) => {
                        console.log('@@@@@@@@ subsc', menus);
                        this.setMenu(menus);
                    });
            });

        this.loginService.auth$
            .pipe(
                filter((auth: Auth) => !!(auth.loginAsUser || auth.user)),
                switchMap(() => this.dotMenuService.reloadMenu())
            )
            .subscribe((menus: DotMenu[]) => {
                this.setMenu(menus);
                this.goToFirstPortlet();
            });

        this.dotLocalstorageService
            .listen<boolean>(DOTCMS_MENU_STATUS)
            .subscribe((collapsed: boolean) => {
                collapsed ? this.collapseMenu() : this.expandMenu();
            });
    }

    get collapsed$(): BehaviorSubject<boolean> {
        return this._collapsed$;
    }

    get items$(): Observable<DotMenu[]> {
        return this._items$.asObservable();
    }

    onNavigationEnd(): Observable<Event> {
        return this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd));
    }

    /**
     * Close all the sections in the menu
     *
     * @memberof DotNavigationService
     */
    closeAllSections(): void {
        const closedMenu: DotMenu[] = this._items$.getValue().map((menu: DotMenu) => {
            menu.isOpen = false;
            return menu;
        });
        this.setMenu(closedMenu);
    }

    /**
     * Collapse the menu and close all the sections in the menu
     *
     * @memberof DotNavigationService
     */
    collapseMenu(): void {
        this._collapsed$.next(true);
        this.closeAllSections();
    }

    /**
     * Open menu section that have menulink active
     *
     * @memberof DotNavigationService
     */
    expandMenu(): void {
        this._collapsed$.next(false);

        const expandedMenu: DotMenu[] = this._items$.getValue().map((menu: DotMenu) => {
            let isActive = false;

            menu.menuItems.forEach((item: DotMenuItem) => {
                if (item.active) {
                    isActive = true;
                }
            });
            menu.isOpen = isActive;
            return menu;
        });
        this.setMenu(expandedMenu);
    }

    /**
     * Navigate to portlet by id
     *
     * @param string url
     * @memberof DotNavigationService
     */
    goTo(url: string): void {
        this.dotRouterService.gotoPortlet(url);
    }

    /**
     * Navigates to the first portlet
     *
     * @memberof DotNavigationService
     */
    goToFirstPortlet(): Promise<boolean> {
        return this.getFirstMenuLink()
            .pipe(
                map((link: string) => {
                    return this.dotRouterService.gotoPortlet(link);
                })
            )
            .toPromise()
            .then((isRouted: Promise<boolean>) => {
                if (!isRouted) {
                    this.reloadIframePage();
                }
                return isRouted;
            });
    }

    /**
     * Reload current portlet
     *
     * @param string id
     * @memberof DotNavigationService
     */
    reloadCurrentPortlet(id: string): void {
        if (this.dotRouterService.currentPortlet.id === id) {
            this.dotRouterService.reloadCurrentPortlet(id);
        }
    }

    /**
     * Toogle expanded/collapsed state of the nav
     *
     * @memberof DotNavigationService
     */
    toggle(): void {
        this.dotEventsService.notify('dot-side-nav-toggle');
        const isCollapsed = this._collapsed$.getValue();
        isCollapsed ? this.expandMenu() : this.collapseMenu();
        this.dotLocalstorageService.setItem<boolean>(
            DOTCMS_MENU_STATUS,
            this._collapsed$.getValue()
        );
    }

    /**
     * Set menu open base on the id of the menulink
     *
     * @param string id
     * @memberof DotNavigationService
     */
    setOpen(id: string): void {
        const updatedMenu: DotMenu[] = this._items$.getValue().map((menu: DotMenu) => {
            menu.isOpen = menu.isOpen ? false : id === menu.id;
            return menu;
        });
        this.setMenu(updatedMenu);
    }

    private addMenuLinks(menu: DotMenu[]): DotMenu[] {
        return menu.map((menuGroup: DotMenu) => {
            menuGroup.menuItems.forEach((menuItem: DotMenuItem) => {
                menuItem.menuLink = menuItem.angular
                    ? menuItem.url
                    : this.getLegacyPortletUrl(menuItem.id);
            });
            return menuGroup;
        });
    }

    private extractFirtsMenuLink(menus: DotMenu[]): string {
        const firstMenuItem: DotMenuItem = menus[0].menuItems[0];
        return firstMenuItem.angular
            ? firstMenuItem.url
            : this.getLegacyPortletUrl(firstMenuItem.id);
    }

    private getFirstMenuLink(): Observable<string> {
        return this.dotMenuService
            .loadMenu()
            .pipe(map((menus: DotMenu[]) => this.extractFirtsMenuLink(menus)));
    }

    private getLegacyPortletUrl(menuItemId: string): string {
        return `/c/${menuItemId}`;
    }

    private reloadIframePage(): void {
        if (this.router.url.indexOf('c/') > -1) {
            this.dotIframeService.reload();
        }
    }

    private reloadNavigation(): Observable<DotMenu[]> {
        console.log('=== reloadNavigation');
        return this.dotMenuService.reloadMenu().pipe(
            setActiveItems({
                url: this.dotRouterService.currentPortlet.id,
                collapsed: this._collapsed$.getValue(),
                previousUrl: this.dotRouterService.previousUrl
            }),
            tap((menus: DotMenu[]) => {
                this.setMenu(menus);
            })
        );
    }

    private setMenu(menu: DotMenu[]) {
        // debugger;
        this._items$.next(this.addMenuLinks(menu));
    }

    private getPageCurrentTitle(url: string, menu: DotMenu[]): string {
        let title = '';
        const flattedMenu = menu
            .reduce((a, { menuItems }) => [...a, ...menuItems], [])
            .reduce((a, { label, menuLink }) => ({ ...a, [menuLink]: label }), {});

        Object.entries(flattedMenu).forEach(([menuLink, label]: [string, string]) => {
            title = url.indexOf(menuLink) >= 0 ? label : title;
        });

        return title;
    }
}
