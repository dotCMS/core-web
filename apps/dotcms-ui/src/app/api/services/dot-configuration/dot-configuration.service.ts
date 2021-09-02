import { Injectable } from '@angular/core';
import { CoreWebService } from '@dotcms/dotcms-js';
import { pluck, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DotConfigurationService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the value of specific keys (separated by comma)
     * from the dotmarketing-config.properties
     *
     * @returns {Observable<string>}
     * @memberof DotConfigurationService
     */
    getKeys(keys: string): Observable<{ [key: string]: any }> {
        return this.coreWebService
            .requestView({
                url: `/api/v1/configuration/config?keys=${keys}`
            })
            .pipe(take(1), pluck('bodyJsonObject'));
    }
}
