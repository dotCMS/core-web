import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';

/**
 * Handle license information of current logged in user
 * @export
 * @class DotLicenseService
 */
@Injectable()
export class DotLicenseService {
    private configUrl: string;

    constructor(private coreWebService: CoreWebService) {
        this.configUrl = 'v1/appconfiguration';
    }

    /**
     * Gets if current user has an enterprise license
     *
     * @returns {Observable<boolean>}
     * @memberof DotLicenseService
     */
    isEnterpriseLicense(): Observable<boolean> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: this.configUrl
            })
            .pluck('entity', 'config', 'license')
            .map((license) => license['level'] >= 200);
    }
}
