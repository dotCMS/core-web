import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { PortletNav } from '../../shared/models/navigation';

@Injectable()
export class DotRouterService {
    constructor(private router: Router) {}

    get currentPortlet(): PortletNav {
        return {
            url: this.router.routerState.snapshot.url,
            id: this.getPortletId(this.router.routerState.snapshot.url)
        };
    }

    public goToMain(): void {
        this.router.navigate(['/']);
    }

    public goToLogin(parameters?: any): void {
        this.router.navigate(['/public/login'], parameters);
    }

    public goToURL(url: string): void {
        this.router.navigate([url]);
    }

    public isPublicUrl(url: string): boolean {
        return url.startsWith('/public');
    }

    public isFromCoreUrl(url: string): boolean {
        return url.startsWith('/fromCore');
    }

    public isRootUrl(url: string): boolean {
        return url === '/';
    }

    public gotoPortlet(portletId: string): void {
        debugger;
        this.router.navigate([portletId]);
    }

    public goToForgotPassword(): void {
        this.router.navigate(['/public/forgotPassword']);
    }

    public goToNotLicensed(): void {
        this.router.navigate(['c/notLicensed']);
    }

    public getPortletId(url: string): string {
        const urlSplit = url.split('/');
        return urlSplit[urlSplit.length - 1];
    }
}
