import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { take, map } from 'rxjs/operators';

/**
 *
 * @export
 * @class DotIframePortletLegacyResolver
 * @implements {Resolve<boolean>}
 */
@Injectable()
export class DotIframePortletLegacyResolver implements Resolve<boolean> {
    constructor(private dotLicenseService: DotLicenseService) {}

    resolve(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.dotLicenseService.canAccessEnterprisePortlet(state.url).pipe(
            take(1),
            map((canAccess: boolean) => canAccess)
        );
    }
}
