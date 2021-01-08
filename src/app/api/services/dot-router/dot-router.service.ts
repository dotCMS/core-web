import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params, Event, NavigationEnd } from '@angular/router';

import { PortletNav } from '@models/navigation';
import { Subject } from 'rxjs';
import { DotAppsSites } from '@shared/models/dot-apps/dot-apps.model';
import { NavigationExtras } from '@angular/router';
import { LOGOUT_URL } from 'dotcms-js';

@Injectable()
export class DotRouterService {
    portletReload$ = new Subject();
    private _previousSavedURL: string;
    private _currentSavedURL: string;
    private CUSTOM_PORTLET_ID_PREFIX = 'c_';

    constructor(private router: Router, private route: ActivatedRoute) {
        console.log('****router service');
        this._currentSavedURL = this.router.url;

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this._previousSavedURL = this._currentSavedURL;
                this._currentSavedURL = event.url;
                console.log('****previous url', this._previousSavedURL);
                console.log('***current url', this._currentSavedURL);
            }
        });

        console.log('****previous url', this._previousSavedURL);
        console.log('***current url', this._currentSavedURL);
    }

    get currentSavedURL(): string {
        return this._currentSavedURL;
    }

    get currentPortlet(): PortletNav {
        return {
            url: this.router.routerState.snapshot.url,
            id: this.getPortletId(this.router.routerState.snapshot.url)
        };
    }

    get previousSavedURL(): string {
        return this._previousSavedURL;
    }

    set previousSavedURL(url: string) {
        this._previousSavedURL = url;
    }

    get queryParams(): Params {
        const nav = this.router.getCurrentNavigation();

        return nav ? nav.finalUrl.queryParams : this.route.snapshot.queryParams;
    }

    /**
     * Redirect to previous url
     *
     * @memberof DotRouterService
     */
    goToPreviousUrl(): void {
        this.router.navigate([this.previousSavedURL]);
    }

    /**
     * Reload the current iframe portlet;
     *
     * @param string id
     * @memberof DotRouterService
     */
    reloadCurrentPortlet(id?: string): void {
        this.portletReload$.next(id);
    }

    /**
     * Go to edit page
     *
     * @param string url
     * @param string [languageId]
     * @returns Promise<boolean>
     * @memberof DotRouterService
     */
    goToEditPage(queryParams: Params): Promise<boolean> {
        return this.router.navigate(['/edit-page/content'], {
            queryParams
        });
    }

    /**
     * Go to edit contentlet
     *
     * @param string inode
     * @returns Promise<boolean>
     * @memberof DotRouterService
     */
    goToEditContentlet(inode: string): Promise<boolean> {
        return this.router.navigate([`${this.currentPortlet.url}/${inode}`]);
    }

    /**
     * Go to edit workflow task
     *
     * @param string inode
     * @returns Promise<boolean>
     * @memberof DotRouterService
     */
    goToEditTask(inode: string): Promise<boolean> {
        return this.router.navigate([`/c/workflow/${inode}`]);
    }

    /**
     * Go to first porlet unless userEditPageRedirect is passed or previousSavedURL is set
     *
     * @param string [userEditPageRedirect]
     * @returns Promise<boolean>
     * @memberof DotRouterService
     */
    goToMain(userEditPageRedirect?: string): Promise<boolean> {
        return userEditPageRedirect
            ? this.goToEditPage({
                  url: userEditPageRedirect
              })
            : this.redirectMain();
    }

    /**
     * Redirects to the login page adding a busting cache parameter.
     *
     * * @param NavigationExtras navExtras
     * @memberof DotRouterService
     */
    goToLogin(navExtras?: NavigationExtras): void {
        this.router.navigate(['/public/login'], this.addCacheBusting(navExtras));
    }

    goToSiteBrowser(): void {
        this.router.navigate(['/c/site-browser']);
    }

    /**
     * Redirect to Starter page
     *
     * @memberof DotRouterService
     */
    goToStarter(): void {
        this.router.navigate(['/starter']);
    }

    /**
     * Redirect to Content page
     *
     * @memberof DotRouterService
     */
    goToContent(): void {
        this.router.navigate(['/c/content']);
    }

    /**
     * Redirect to Content page
     *
     * @memberof DotRouterService
     */
    goToCreateContent(variableName: string): void {
        this.router.navigate([`/c/content/new/${variableName}`]);
    }

    goToEditContentType(id: string, portlet: string): void {
        this.router.navigate([`/${portlet}/edit/${id}`]);
    }

    /**
     * Redirect to edit the template id passed
     *
     * @param {string} id
     * @memberof DotRouterService
     */
    goToEditTemplate(id: string): void {
        this.router.navigate([`/templates/edit/${id}`]);
    }

    goToURL(url: string): void {
        this.router.navigate([url]);
    }

    /**
     * Redirects to backend to handle the logout.
     *
     * @memberof DotRouterService
     */
    doLogOut(): void {
        window.location.href = LOGOUT_URL;
    }

    /**
     * Redirects to an App Configuration page
     *
     * @param string appKey
     * @memberof DotRouterService
     */
    goToAppsConfiguration(appKey: string) {
        this.router.navigate([`/apps/${appKey}`]);
    }

    /**
     * Redirects to create/edit configuration site page
     *
     * @param string integrationKey
     * @param DotAppsSites site
     * @memberof DotRouterService
     */
    goToUpdateAppsConfiguration(integrationKey: string, site: DotAppsSites) {
        const route =
            site && site.configured
                ? `/apps/${integrationKey}/edit/${site.id}`
                : `/apps/${integrationKey}/create/${site.id}`;
        this.router.navigate([route]);
    }

    isPublicUrl(url: string): boolean {
        return url.startsWith('/public');
    }

    isFromCoreUrl(url: string): boolean {
        return url.startsWith('/fromCore');
    }

    isRootUrl(url: string): boolean {
        return url === '/';
    }

    /**
     * Check if Portlet is based on a JSP/iframe page
     * @returns boolean
     * @memberof DotRouterService
     */
    isJSPPortlet(): boolean {
        return this.router.url.startsWith('/c/');
    }

    /**
     * Check if the current route is an edit page
     *
     * @returns boolean
     * @memberof DotRouterService
     */
    isEditPage(): boolean {
        return this.currentPortlet.id === 'edit-page';
    }

    gotoPortlet(link: string, replaceUrl?: boolean): Promise<boolean> {
        return this.router.navigateByUrl(link, { replaceUrl: replaceUrl });
    }

    goToForgotPassword(): void {
        this.router.navigate(['/public/forgotPassword']);
    }

    goToNotLicensed(): void {
        this.router.navigate(['c/notLicensed']);
    }

    getPortletId(url: string): string {
        url = decodeURIComponent(url);
        if (url.indexOf('?') > 0) {
            url = url.substring(0, url.indexOf('?'));
        }

        const urlSegments = url
            .split('/')
            .filter((item) => item !== '' && item !== '#' && item !== 'c');
        return urlSegments.indexOf('add') > -1 ? urlSegments.splice(-1)[0] : urlSegments[0];
    }

    isPublicPage(): boolean {
        return this.currentPortlet.url.startsWith('/public');
    }

    /**
     * Return true if the current portlet is a custom portlet
     *
     * @returns {boolean}
     * @memberof DotRouterService
     */
    isCurrentPortletCustom(): boolean {
        return this.isCustomPortlet(this.currentPortlet.id);
    }

    /**
     * Return true if potlrtId represent a custom portlet
     *
     * @param {string} portletId
     * @returns {boolean}
     * @memberof DotRouterService
     */
    isCustomPortlet(portletId: string): boolean {
        return portletId.startsWith(this.CUSTOM_PORTLET_ID_PREFIX);
    }

    /**
     * Replace the query params received, in the URL
     *
     * @param {{ [key: string]: string | number }} params
     * @returns {void}
     * @memberof DotRouterService
     */
    replaceQueryParams(params: { [key: string]: string | number }): void {
        this.router.navigate([], {
            queryParams: params,
            queryParamsHandling: 'merge'
        });
    }

    private redirectMain(): Promise<boolean> {
        if (this._previousSavedURL) {
            return this.router.navigate([this.previousSavedURL]).then((ok: boolean) => {
                this.previousSavedURL = null;
                return ok;
            });
        } else {
            return this.router.navigate(['/']);
        }
    }

    private addCacheBusting(navExtras: NavigationExtras): NavigationExtras {
        if (navExtras) {
            navExtras.queryParams['r'] = new Date().getTime();
        } else {
            navExtras = { queryParams: { r: new Date().getTime() } };
        }

        return navExtras;
    }
}
