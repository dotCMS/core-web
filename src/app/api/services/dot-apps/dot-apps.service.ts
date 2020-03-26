import { pluck, catchError, take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DotApps, DotAppsSaveData } from '@models/dot-apps/dot-apps.model';
import { RequestMethod } from '@angular/http';
import { CoreWebService, ResponseView } from 'dotcms-js';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';

const serviceIntegrationUrl = `v1/apps`;

/**
 * Provide util methods to get service integrations in the system.
 * @export
 * @class DotAppsService
 */
@Injectable()
export class DotAppsService {
    constructor(
        private coreWebService: CoreWebService,
        private httpErrorManagerService: DotHttpErrorManagerService
    ) {}

    /**
     * Return a list of Service Integrations.
     * @returns Observable<DotApps[]>
     * @memberof DotAppsService
     */
    get(): Observable<DotApps[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: serviceIntegrationUrl
            })
            .pipe(
                pluck('entity'),
                catchError((error: ResponseView) => {
                    return this.httpErrorManagerService.handle(error).pipe(
                        take(1),
                        map(() => null)
                    );
                })
            );
    }

    /**
     * Return a list of configurations of a specific Apps
     * @param {string} serviceKey
     * @returns Observable<DotApps>
     * @memberof DotAppsService
     */
    getConfigurationList(serviceKey: string): Observable<DotApps> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `${serviceIntegrationUrl}/${serviceKey}`
            })
            .pipe(
                pluck('entity'),
                catchError((error: ResponseView) => {
                    return this.httpErrorManagerService.handle(error).pipe(
                        take(1),
                        map(() => null)
                    );
                })
            );
    }

    /**
     * Return a detail configuration of a specific App
     * @param {string} serviceKey
     * @param {string} id
     * @returns Observable<DotServiceIntegration>
     * @memberof DotAppsService
     */
    getConfiguration(serviceKey: string, id: string): Observable<DotApps> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `${serviceIntegrationUrl}/${serviceKey}/${id}`
            })
            .pipe(
                pluck('entity'),
                catchError((error: ResponseView) => {
                    return this.httpErrorManagerService.handle(error).pipe(
                        take(1),
                        map(() => null)
                    );
                })
            );
    }

    /**
     * Saves a detail configuration of a specific Service Integration
     * @param {string} serviceKey
     * @param {string} id
     * @param {[key: string]: string} params
     * @returns Observable<DotServiceIntegration>
     * @memberof DotServiceIntegrationService
     */
    saveSiteConfiguration(
        serviceKey: string,
        id: string,
        params: DotAppsSaveData
    ): Observable<string> {
        console.log('***param', params);
        return this.coreWebService
            .requestView({
                body: {
                    params
                },
                method: RequestMethod.Post,
                url: `${serviceIntegrationUrl}/${serviceKey}/${id}`
            })
            .pipe(
                pluck('entity'),
                catchError((error: ResponseView) => {
                    return this.httpErrorManagerService.handle(error).pipe(
                        take(1),
                        map(() => null)
                    );
                })
            );
    }

    /**
     * Delete configuration of a specific Service Integration
     * @param {string} serviceKey
     * @param {string} hostId
     * @returns Observable<string>
     * @memberof DotAppsService
     */
    deleteConfiguration(serviceKey: string, hostId: string): Observable<string> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `${serviceIntegrationUrl}/${serviceKey}/${hostId}`
            })
            .pipe(
                pluck('entity'),
                catchError((error: ResponseView) => {
                    return this.httpErrorManagerService.handle(error).pipe(
                        take(1),
                        map(() => null)
                    );
                })
            );
    }

    /**
     * Delete all configuration of a specific Service Integration
     * @param {string} serviceKey
     * @returns Observable<string>
     * @memberof DotAppsService
     */
    deleteAllConfigurations(serviceKey: string): Observable<string> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Delete,
                url: `${serviceIntegrationUrl}/${serviceKey}`
            })
            .pipe(
                pluck('entity'),
                catchError((error: ResponseView) => {
                    return this.httpErrorManagerService.handle(error).pipe(
                        take(1),
                        map(() => null)
                    );
                })
            );
    }
}
