import { pluck, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DotServiceIntegration } from '@models/dot-service-integration/dot-service-integration.model';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js';

/**
 * Provide util methods to get service integrations in the system.
 * @export
 * @class DotServiceIntegrationService
 */
@Injectable()
export class DotServiceIntegrationService {
    constructor(private coreWebService: CoreWebService) {}

    // constructor() {}

    /**
     * Return a list of Service Integrations.
     * @returns Observable<DotServiceIntegration[]>
     * @memberof DotServiceIntegrationService
     */
    get(): Observable<DotServiceIntegration[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/service/integration`
            })
            .pipe(
                pluck('entity'),
                catchError(() => of(null))
            );
    }

    /**
     * Return configurations of a specific Service Integration
     * @param {string} serviceKey
     * @returns Observable<DotServiceIntegration>
     * @memberof DotServiceIntegrationService
     */
    getConfiguration(serviceKey: string): Observable<DotServiceIntegration> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/service/integration/${serviceKey}`
            })
            .pipe(
                pluck('entity'),
                catchError(() => of(null))
            );
    }

    /**
     * Delete configuration of a specific Service Integration
     * @param {string} serviceKey
     * @param {string} hostId
     * @returns Observable<string>
     * @memberof DotServiceIntegrationService
     */
    deleteConfiguration(serviceKey: string, hostId: string): Observable<string> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `v1/service/integration/${serviceKey}/${hostId}`
            })
            .pipe(
                pluck('entity'),
                catchError(() => of(null))
            );
    }

    /**
     * Delete all configuration of a specific Service Integration
     * @param {string} serviceKey
     * @returns Observable<string>
     * @memberof DotServiceIntegrationService
     */
    deleteAllConfigurations(serviceKey: string): Observable<string> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `v1/service/integration/${serviceKey}`
            })
            .pipe(
                pluck('entity'),
                catchError(() => of(null))
            );
    }
}
