import { map, pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CoreWebService } from '@dotcms/dotcms-js';
import { Observable } from 'rxjs';

export interface DotTimeZone {
    id: string;
    label: string;
    offset: string;
}

/**
 * Handle timezones information used on the BE
 * @export
 * @class DotTimeZoneService
 */
@Injectable()
export class DotTimeZoneService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Returns list of timezone.
     * @returns Observable<DotTimeZone[]>
     * @memberof DotPersonasService
     */
    get(): Observable<DotTimeZone[]> {
        return this.coreWebService
            .requestView({
                url: 'v1/appconfiguration'
            })
            .pipe(
                pluck('entity', 'config', 'timezones'),
                map((timezones: DotTimeZone[]) => {
                    return timezones.sort((a: DotTimeZone, b: DotTimeZone) => {
                        if (a.label > b.label) {
                            return 1;
                        }
                        if (a.label < b.label) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                })
            );
    }
}
