import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { PortletNav } from '../../shared/models/navigation';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DotRouterService {
    portletReload$ = new Subject();
    private _previousSavedURL: string;

    constructor(
        private router: Router
    ) {}

    get currentPortlet(): PortletNav {
        return {
            url: this.router.routerState.snapshot.url,
            id: this.getPortletId(this.router.routerState.snapshot.url)
        };
    }

    /**
     * Reload the current iframe portlet;
     *
     * @param {string} id
     * @memberof DotRouterService
     */
    reloadCurrentPortlet(id: string): void {
        this.portletReload$.next(id);
    }

    goToEditPage(url: any): void {
        this.router.navigate(['/edit-page/content'], { queryParams: { url: url } });
    }

    goToMain(): Promise<boolean> {
        return this.router.navigate([this._previousSavedURL || '/']);
    }

    goToLogin(parameters?: any): void {
        this.router.navigate(['/public/login'], parameters);
    }

    goToURL(url: string): void {
        this.router.navigate([url]);
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
        if (url.indexOf('?url=') > 0) {
            url = url.substring(0, url.indexOf('?url='));
        }

        const urlSegments = url.split('/').filter((item) => item !== '' && item !== '#' && item !== 'c');
        return urlSegments.indexOf('add') > -1 ? urlSegments.splice(-1)[0] : urlSegments[0];
    }

    set previousSavedURL(url: string) {
        this._previousSavedURL = url;
    }

    get previousSavedURL(): string {
        return this._previousSavedURL;
    }

    isPublicPage(): boolean {
        return this.currentPortlet.url.startsWith('/public');
    }
}
