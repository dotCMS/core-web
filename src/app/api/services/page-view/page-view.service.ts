import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class PageViewService {
    constructor(private coreWebService: CoreWebService) {}

    get(url: string): Observable<any> {
        return this.coreWebService.requestView({
            method: RequestMethod.Get,
            url: url
        });
    }
}
