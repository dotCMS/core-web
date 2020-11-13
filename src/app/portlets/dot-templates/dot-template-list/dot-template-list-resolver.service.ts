import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DotTemplate } from '@portlets/dot-edit-page/shared/models';
import { map, take } from 'rxjs/operators';
import { OrderDirection, PaginatorService } from '@services/paginator';
import { DotEnvironment } from '@models/dot-environment/dot-environment';
import { DotLicenseService } from '@services/dot-license/dot-license.service';
import { PushPublishService } from '@services/push-publish/push-publish.service';

@Injectable({
    providedIn: 'root'
})
export class DotTemplateListResolver implements Resolve<[DotTemplate[], boolean, boolean]> {
    constructor(
        public paginatorService: PaginatorService,
        public dotLicenseService: DotLicenseService,
        public pushPublishService: PushPublishService
    ) {}

    resolve(): Observable<[DotTemplate[], boolean, boolean]> {
        this.paginatorService.url = '/api/v1/templates';
        this.paginatorService.sortField = 'modDate';
        this.paginatorService.sortOrder = OrderDirection.DESC;

        return forkJoin([
            this.paginatorService.getFirstPage().pipe(take(1)),
            this.dotLicenseService.isEnterprise(),
            this.pushPublishService
                .getEnvironments()
                .pipe(map((environments: DotEnvironment[]) => !!environments.length), take(1))
        ]);
    }
}
