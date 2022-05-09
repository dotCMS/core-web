import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { DotCMSContentlet, DotCMSContentType } from '@dotcms/dotcms-models';
// eslint-disable-next-line max-len
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SuggestionsService {
    constructor(private http: HttpClient) {}

    getContentTypes(filter = '', allowedTypes = ''): Observable<DotCMSContentType[]> {
        return this.http
            .post(
                `/api/v1/contenttype/allowedtypes?filter=${filter}&orderby=name&direction=ASC&per_page=40`,
                {
                    types: allowedTypes
                }
            )
            .pipe(pluck('entity'));
    }

    getContentlets(contentType = '', filter = ''): Observable<DotCMSContentlet[]> {
        return this.http
            .post('/api/content/_search', {
                query: `+contentType:${contentType} +languageId:1 +deleted:false +working:true +catchall:${filter}* title:'${filter}'^15`,
                sort: 'modDate desc',
                offset: 0,
                limit: 40
            })
            .pipe(pluck('entity', 'jsonObjectView', 'contentlets'));
    }
}
