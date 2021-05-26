import { Injectable } from '@angular/core';
import { DotcmsConfigService } from '@dotcms/dotcms-js';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DotNavLogoService {
    navBarLogo$: BehaviorSubject<string | boolean> = new BehaviorSubject('');
    DEFAULT_NAV_LOGO = `/image/company_logo?img_id=dotcms.org`;

    constructor(private dotCmsConfigService: DotcmsConfigService) {}

    setInitialLogo() {
        return this.dotCmsConfigService
            .getConfig()
            .pipe(
                map((config) => config.logos.navBar),
                filter((logo) => logo !== 'NA'),
                map((logo) => this.setUrlProperty(logo))
            )
            .subscribe((logo) => {
                this.navBarLogo$.next(logo);
            });
    }

    changeLogo(navLogo: string): void {
        if (!navLogo) {
            this.navBarLogo$.next(false);
            return;
        }
        this.navBarLogo$.next(this.setUrlProperty(navLogo));
    }

    private setUrlProperty(navLogo: string): string {
        return `url("${navLogo}")`;
    }
}
