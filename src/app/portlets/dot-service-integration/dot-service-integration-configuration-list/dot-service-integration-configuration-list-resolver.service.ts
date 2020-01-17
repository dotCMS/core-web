import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { DotServiceIntegration } from '@shared/models/dot-service-integration/dot-service-integration.model';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';

/**
 * Returns service integrations list from the system
 *
 * @export
 * @class DotServiceIntegrationPageResolver
 * @implements {Resolve<DotServiceIntegration>}
 */
@Injectable()
export class DotServiceIntegrationConfigurationListResolver
    implements Resolve<DotServiceIntegration> {
    constructor(private dotServiceIntegrationService: DotServiceIntegrationService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DotServiceIntegration> {
        const serviceKey = route.paramMap.get('serviceKey');
        return this.dotServiceIntegrationService.getConfiguration(serviceKey).pipe(take(1));
    }
}
