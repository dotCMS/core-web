import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DotRouterService } from '../dot-router/dot-router.service';
import { environment } from '../../../../environments/environment';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/internal/operators/take';

/**
 * Route Guard that checks if a User have access to the enterprise portlet.
 */
@Injectable()
export class DotLicenseGuardService implements CanActivate {
    constructor(
        private dotRouterService: DotRouterService,
        private dotLicense: DotLicenseService,
        private location: Location
    ) {}

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return !environment.production && state.url === '/pl'
            ? observableOf(true)
            : this.canAccessPortlet(state.url);
    }

    canActivateChild(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return !environment.production && state.url === '/pl'
            ? observableOf(true)
            : this.canAccessPortlet(state.url);
    }

    private canAccessPortlet(url: string): Observable<boolean> {
        return this.dotLicense.canAccessEnterprisePortlet(url).pipe(
            take(1),
            map((canAccess: boolean) => {
                if (!canAccess) {
                    this.isRulesInternalPortlet(url);
                    this.location.replaceState(url);
                }
                return canAccess;
            })
        );
    }

    private isRulesInternalPortlet(url: string): void {
        if (url.indexOf('fromCore/rules') < 0) {
            this.dotRouterService.goToNotLicensed();
        } else {
            this.dotRouterService.goToNotLicensedWithoutWrapper();
        }
    }
}
