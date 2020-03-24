import { Observable, forkJoin, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
// import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';
import { DotMessageService } from '@services/dot-messages-service';
import { IntegrationResolverData } from '../dot-service-integration-configuration/dot-service-integration-configuration-resolver.service';

/**
 * Returns service integration configuration detail from the api
 *
 * @export
 * @class DotServiceIntegrationConfigurationDetailResolver
 * @implements {Resolve<DotServiceIntegration>}
 */
@Injectable()
export class DotServiceIntegrationConfigurationDetailResolver
    implements Resolve<IntegrationResolverData> {
    constructor(
        // private dotServiceIntegrationService: DotServiceIntegrationService,
        public dotMessageService: DotMessageService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IntegrationResolverData> {
        const serviceKey = route.paramMap.get('serviceKey');
        const id = route.paramMap.get('id');
        console.log('--llego', serviceKey, id);
        // const servicesConfigurations$ = this.dotServiceIntegrationService
        //     .getConfiguration(serviceKey, id)
        //     .pipe(take(1));
        const servicesConfigurations$ = of({
            name: 'sampleDescriptor1',
            key: 'sampleDescriptor1',
            sites: [
                {
                    id: '1a',
                    name: 'demo',
                    secrets: [
                        {
                            dynamic: false,
                            hidden: false,
                            hint: 'Here is your name!',
                            label: 'Name:',
                            name: 'name',
                            required: true,
                            type: 'STRING',
                            value: 'John se la come!'
                        },
                        {
                            dynamic: false,
                            hidden: true,
                            hint: 'Here is your password!',
                            label: 'Password:',
                            name: 'password',
                            required: false,
                            type: 'STRING',
                            value: '****'
                        },
                        {
                            dynamic: false,
                            hint: 'is it enabled!',
                            hidden: false,
                            label: 'Enabled:',
                            name: 'enabled',
                            required: false,
                            type: 'BOOL',
                            value: 'true'
                        }
                    ]
                }
            ]
        });

        const messages$: Observable<{
            [key: string]: string;
        }> = this.dotMessageService
            .getMessages([
                'apps.configurations',
                'apps.key',
                'apps.add.property',
                'Cancel',
                'Save'
            ])
            .pipe(take(1));

        return forkJoin([servicesConfigurations$, messages$]).pipe(
            switchMap(([integration, messages]) => {
                return of({ messages, service: integration });
            })
        );
    }
}
