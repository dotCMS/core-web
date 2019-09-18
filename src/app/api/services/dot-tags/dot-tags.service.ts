import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotTag } from '@models/dot-tag';
import { RequestMethod } from '@angular/http';
import { map, pluck } from 'rxjs/operators';

/**
 * Provide util methods to get Tags available in the system.
 * @export
 * @class DotTagsService
 */
@Injectable()
export class DotTagsService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get tags suggestions
     * @returns Observable<DotTag[]>
     * @memberof DotTagDotTagsServicesService
     */
    getSuggestions(name?: string): Observable<DotTag[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: name ? `v1/tags?name=${name}` : 'v1/tags'
            })
            .pipe(
                pluck('bodyJsonObject'),
                map(tags => {
                    return Object.entries(tags).map(([_key, value]) => value);
                })
            );
    }
}
