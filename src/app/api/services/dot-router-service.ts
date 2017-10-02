import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { PortletNav } from '../../shared/models/navigation';
import { DotMenuService } from './dot-menu.service';
import { Subject } from 'rxjs/Subject';
import { DotNavigationService } from '../../view/components/dot-navigation/dot-navigation.service';

@Injectable()
export class DotRouterService {
    portletReload$ = new Subject();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dotMenuService: DotMenuService
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
        if (id === this.currentPortlet.id) {
            this.portletReload$.next();
        }
    }

    goToMain(): void {
        this.router.navigate(['/']);
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

    gotoPortlet(link: string, replaceUrl: boolean): Promise<boolean> {
        return this.router.navigate([link], { replaceUrl: replaceUrl });
    }

    goToForgotPassword(): void {
        this.router.navigate(['/public/forgotPassword']);
    }

    goToNotLicensed(): void {
        this.router.navigate(['c/notLicensed']);
    }

    getPortletId(url: string): string {
        const urlSplit = url.split('/');
        return urlSplit[urlSplit.length - 1];
    }

    reloadPortlet() {}
}
