import { Observable, forkJoin, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
// import { DotAppsService } from '@services/dot-apps/dot-apps.service';
import { DotMessageService } from '@services/dot-messages-service';
import { AppsResolverData } from '../dot-apps-configuration/dot-apps-configuration-resolver.service';

/**
 * Returns app configuration detail from the api
 *
 * @export
 * @class DotAppsConfigurationDetailResolver
 * @implements {Resolve<AppsResolverData>}
 */
@Injectable()
export class DotAppsConfigurationDetailResolver
    implements Resolve<AppsResolverData> {
    constructor(
        // private dotAppsService: DotAppsService,
        public dotMessageService: DotMessageService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<AppsResolverData> {
        const appKey = route.paramMap.get('appKey');
        const id = route.paramMap.get('id');
        console.log('--llego', appKey, id);
        // const appConfigurations$ = this.dotAppsService
        //     .getConfiguration(appKey, id)
        //     .pipe(take(1));
        const appConfigurations$ = of({
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

        return forkJoin([appConfigurations$, messages$]).pipe(
            switchMap(([app, messages]) => {
                return of({ messages, app });
            })
        );
    }
}
