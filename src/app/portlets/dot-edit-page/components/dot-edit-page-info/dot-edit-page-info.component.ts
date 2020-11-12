import { Component, OnInit, Input, Inject } from '@angular/core';

import { DotPageRenderState } from '../../shared/models/dot-rendered-page-state.model';
import { SiteService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Site } from 'dotcms-js/lib/core/treeable/shared/site.model';
import { LOCATION_TOKEN } from 'src/app/providers';

/**
 * Basic page information for edit mode
 *
 * @export
 * @class DotEditPageInfoComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'dot-edit-page-info',
    templateUrl: './dot-edit-page-info.component.html',
    styleUrls: ['./dot-edit-page-info.component.scss']
})
export class DotEditPageInfoComponent implements OnInit {
    @Input() pageState: DotPageRenderState;

    url$: Observable<string>;
    apiLink: string;

    constructor(
        private siteService: SiteService,
        @Inject(LOCATION_TOKEN) private location: Location
    ) {}

    ngOnInit() {
        this.url$ = this.getFullUrl(this.pageState.page.pageURI);
        this.apiLink = `api/v1/page/render${this.pageState.page.pageURI}?language_id=${this.pageState.page.languageId}`;
    }

    private getFullUrl(url: string): Observable<string> {
        return this.siteService.getCurrentSite().pipe(
            map((site: Site) => {
                return [
                    this.location.protocol,
                    '//',
                    site.hostname,
                    this.location.port ? `:${this.location.port}` : '',
                    url
                ].join('');
            })
        );
    }
}
