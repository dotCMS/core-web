import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/core/core-web.service';
import { RequestMethod } from '@angular/http';
import { DotPageContainer } from '../../shared/models/dot-page-container.model';
import { DotPageContent } from '../../shared/models/dot-page-content.model';
import { ContentType } from '../../../content-types/shared/content-type.model';


@Injectable()
export class DotContainerContentletService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the HTML of a contentlet inside a container
     *
     * @param {DotPageContainer} container
     * @param {DotPageContent} content
     * @returns {Observable<string>}
     * @memberof DotContainerContentletService
     */
    getContentletToContainer(container: DotPageContainer, content: DotPageContent): Observable<string> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/containers/${container.identifier}/uuid/${container.uuid}/content/${content.identifier}`
            })
            .pluck('bodyJsonObject', 'render');
    }

    getFormToContainer(container: DotPageContainer, form: ContentType): Observable<{render: string, content: DotPageContent}>  {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/containers/${container.identifier}/uuid/${container.uuid}/form/${form.id}`
            })
            .pluck('entity', 'render');
    }
}
