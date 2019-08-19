import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { pluck, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DotContentService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Create Content, of the specified Content Type.
     * @param content data
     * @returns Content
     */
    create(data: any): Observable<any> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `v1/workflow/actions/default/fire/NEW`,
                body: { contentlet: { ...data } }
            })
            .pipe(take(1), pluck('entity'));
    }
}
