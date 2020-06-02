import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { take, map } from 'rxjs/operators';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [],
    selector: 'dot-main-core-component',
    template: `<router-outlet></router-outlet>`
})
export class MainCoreLegacyComponent implements OnInit {
    constructor(
        public router: Router,
        private dotLicense: DotLicenseService,
        private dotRouterService: DotRouterService
    ) {
        console.log('*****LLEGO OLD constr');
    }

    ngOnInit(): void {
        this.dotLicense
            .canAccessEnterprisePortlet(window.location.hash)
            .pipe(
                take(1),
                map((canAccess: boolean) => {
                    if (!canAccess) {
                        this.dotRouterService.goToNotLicensedWithoutWrapper();
                    }
                })
            )
            .subscribe();
    }
}
