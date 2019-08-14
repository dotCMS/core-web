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
                method: RequestMethod.Post,
                url: `v1/workflow/actions/b9d89c80-3d88-4311-8365-187323c96436/fire`,
                body: { contentlet: { ...data } }
            })
            .pipe(take(1), pluck('entity'));
    }
}
