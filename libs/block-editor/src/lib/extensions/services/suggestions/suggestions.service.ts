import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { DotCMSContentlet, DotCMSContentType } from '@dotcms/dotcms-models';
// eslint-disable-next-line max-len
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContentletFilters } from '../../../models/dot-bubble-menu.model';

@Injectable()
export class SuggestionsService {
    constructor(private http: HttpClient) {}

    get defaultHeaders() {
        const headers = new HttpHeaders();
        headers.set('Accept', '*/*').set('Content-Type', 'application/json');
        return headers;
    }

    getContentTypes(filter = ''): Observable<DotCMSContentType[]> {
        return this.http
            .get(`/api/v1/contenttype?filter=${filter}&orderby=name&direction=ASC&per_page=40`, {
                headers: this.defaultHeaders
            })
            .pipe(pluck('entity'));
    }

    // TODO: change the contentType param to use an Enum
    getContentlets({
        contentType,
        filter,
        currentLanguage
    }: ContentletFilters): Observable<DotCMSContentlet[]> {
        return this.http
            .post('/api/content/_search', {
                query: `+contentType:${contentType} +languageId:${currentLanguage} +deleted:false +working:true +catchall:${filter}* title:'${filter}'^15`,
                sort: 'modDate desc',
                offset: 0,
                limit: 40
            })
            .pipe(pluck('entity', 'jsonObjectView', 'contentlets'));
    }
}
