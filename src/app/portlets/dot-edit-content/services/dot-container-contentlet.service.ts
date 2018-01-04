import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/core/core-web.service';
import { RequestMethod } from '@angular/http';

@Injectable()
export class DotContainerContentletService {
    constructor(private coreWebService: CoreWebService) {}

    getContentletToContainer(containerId: string, contentletId: string): Observable<string> {
        return this.coreWebService.requestView({
            method: RequestMethod.Get,
            url: `v1/containers/${containerId}/uuid/LEGACY_RELATION_TYPE/content/${contentletId}`
        }).pluck('bodyJsonObject', 'render');
    }

    saveContentlet(pageId: string, model: any): Observable<string> {
        return this.coreWebService.requestView({
            method: RequestMethod.Post,
            body: model,
            url: `/v1/page/${pageId}/content`
        }).pluck('entity');
    }
}
