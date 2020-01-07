// import { pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DotServiceIntegration } from '@models/dot-service-integration/dot-service-integration.model';
// import { RequestMethod } from '@angular/http';
// import { CoreWebService } from 'dotcms-js';

/**
 * Provide util methods to get service integrations in the system.
 * @export
 * @class DotServiceIntegrationService
 */
@Injectable()
export class DotServiceIntegrationService {
    // constructor(private coreWebService: CoreWebService) {}

    constructor() {}

    /**
     * Return a list of Service Integrations.
     * @returns Observable<DotServiceIntegration[]>
     * @memberof DotServiceIntegrationService
     */
    get(): Observable<DotServiceIntegration[]> {
        /*
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/service/integration`
            })
            .pipe(pluck('entity'));
            */

        return of([
            {
                integrationsCount: 0,
                serviceKey: 'google-calendar',
                name: 'Google Calendar',
                description: "It's a tool to keep track of your life's events",
                iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg'
            },
            {
                integrationsCount: 1,
                serviceKey: 'asana',
                name: 'Asana',
                description: "It's asana to keep track of your asana events",
                iconUrl: '/dA/792c7c9f-6b6f-427b-80ff-1643376c9999/photo/mountain-persona.jpg'
            }
        ]);
    }

    /**
     * Return configurations of a specific Service Integration
     * @param {string} serviceKey
     * @returns Observable<DotServiceIntegration>
     * @memberof DotServiceIntegrationService
     */
    getConfiguration(_serviceKey: string): Observable<DotServiceIntegration> {
        /*
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/service/integration/${serviceKey}`
            })
            .pipe(pluck('entity'));
            */

        return of({
            integrationsCount: 2,
            serviceKey: 'google-calendar',
            name: 'Google Calendar',
            description: "It's a tool to keep track of your life's events",
            iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg',
            hosts: [
                {
                    hostId: '123',
                    hostName: 'demo.dotcms.com'
                },
                {
                    hostId: '456',
                    hostName: 'host.example.com'
                }
            ]
        });
    }

    /**
     * Delete configuration of a specific Service Integration
     * @param {string} serviceKey
     * @param {string} hostId
     * @returns Observable<string>
     * @memberof DotServiceIntegrationService
     */
    deleteConfiguration(_serviceKey: string, _hostId: string): Observable<string> {
        /*
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `v1/service/integration/${serviceKey}/${hostId}`
            })
            .pipe(pluck('entity'));
            */

        return of('200');
    }
}
