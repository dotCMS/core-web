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

    get(name?: string): Observable<DotTag[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/tags?name=${name ? name : ''}`
            })
            .pipe(
                pluck('bodyJsonObject'),
                map(tags => {
                    const tagsArr = [];
                    Object.entries(tags).forEach(([_key, value]) => tagsArr.push(value));
                    return tagsArr;
                })
            );
    }
}
