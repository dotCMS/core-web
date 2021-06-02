import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class DotNavLogoService {
    navBarLogo$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor() {}

    /**
     * Sets a logo for the nav bar
     *
     * @param {string} navLogo
     * @return {*}  {void}
     * @memberof DotNavLogoService
     */
    setLogo(navLogo: string): void {
        if (!navLogo || !navLogo.startsWith('/dA')) {
            this.navBarLogo$.next(null);
            return;
        }
        this.navBarLogo$.next(this.setUrlProperty(navLogo));
    }

    private setUrlProperty(navLogo: string): string {
        return `url("${navLogo}")`;
    }
}
