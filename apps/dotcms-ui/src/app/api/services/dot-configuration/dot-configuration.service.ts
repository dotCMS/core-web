import { Injectable } from '@angular/core';
import { CoreWebService } from '@dotcms/dotcms-js';
import { map, pluck, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DotConfigurationService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the value of specific key
     * from the dotmarketing-config.properties
     *
     * @returns {Observable<T>}
     * @memberof DotConfigurationService
     */
    getKey<T>(key: string): Observable<T> {
        return this.coreWebService
            .requestView({
                url: `/api/v1/configuration/config?keys=${key}`
            })
            .pipe(
                take(1),
                pluck('bodyJsonObject'),
                map((response) => response[key])
            );
    }

    /**
     * Get the value of specific key as a list
     * from the dotmarketing-config.properties
     *
     * @returns {Observable<T>}
     * @memberof DotConfigurationService
     */
    getKeyAsList<T>(key: string): Observable<T> {
        const finalKey = `list:${key}`;
        return this.coreWebService
            .requestView<{ [key: string]: any }>({
                url: `/api/v1/configuration/config?keys=${finalKey}`
            })
            .pipe(
                take(1),
                pluck('bodyJsonObject'),
                map((response) => {
                    return response[finalKey];
                })
            );
    }
}
