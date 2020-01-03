import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { DotServiceIntegration } from '@shared/models/dot-service-integration/dot-service-integration.model';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';

/**
 * Returns service integrations list from the system
 *
 * @export
 * @class DotServiceIntegrationPageResolver
 * @implements {Resolve<DotServiceIntegration[]>}
 */
@Injectable()
export class DotServiceIntegrationPageResolver implements Resolve<DotServiceIntegration[]> {
    constructor(private dotServiceIntegrationService: DotServiceIntegrationService) {}

    resolve(): Observable<DotServiceIntegration[]> {
        return this.dotServiceIntegrationService.get().pipe(
            take(1),
            tap((integrations: DotServiceIntegration[]) => {
                return integrations;
            })
        );
    }
}
