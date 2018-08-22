import { Component, SecurityContext } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { DomSanitizer } from '@angular/platform-browser';
import { CrumbTrailService, DotCrumb } from './services/dot-crumb-trail.service';

@Component({
    selector: 'dot-crumb-trail',
    templateUrl: './dot-crumb-trail.component.html'
})
export class DotCrumbTrailComponent {
    public crumbs: MenuItem[];

    constructor(private crumbTrailService: CrumbTrailService, private sanitizer: DomSanitizer) {
        this.crumbTrailService.crumbTrail.subscribe(crumsTrail => {
            this.crumbs = crumsTrail.crumbs.map((crumb) => {
                return {
                    label: crumb.label,
                    url: crumb.queryParams ? this.getUrlWithQueryParams(crumb) : crumb.url
                };
            });

            if (crumsTrail.parentMenuLabel) {
                this.crumbs.unshift({
                    label: crumsTrail.parentMenuLabel
                });
            }
        });
    }

    private getUrlWithQueryParams(crumb: DotCrumb): string {
        const params = Object.keys(crumb.queryParams)
            .map(param => `${param}=${crumb.queryParams[param]}`)
            .join('&');

        return this.sanitizer.sanitize(SecurityContext.URL, `${crumb.url}?${params}`);
    }
}
