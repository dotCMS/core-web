import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/core/core-web.service';
import { RequestMethod } from '@angular/http';
import { DotContainerColumn } from '../../dot-edit-page/shared/models/dot-container-column.model';

@Injectable()
export class DotContainerContentletService {
    constructor(private coreWebService: CoreWebService) {}

    getContentletToContainer(containerId: string, contentletId: string): Observable<string> {
        return this.coreWebService.requestView({
            method: RequestMethod.Get,
            url: `v1/containers/${containerId}/uuid/LEGACY_RELATION_TYPE/content/${contentletId}`
        }).pluck('bodyJsonObject', 'render');
    }

    /**
     * Save a page's content
     * @param pageId Page's ID
     * @param model content model
     */
    // TODO create a interface for model
    saveContentlet(pageId: string, content: DotContainerColumn[]): Observable<string> {
        return this.coreWebService.requestView({
            method: RequestMethod.Post,
            body: content,
            url: `/v1/page/${pageId}/content`
        }).pluck('entity');
    }
}
