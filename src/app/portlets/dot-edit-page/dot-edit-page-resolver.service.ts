import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PageViewService } from './../../api/services/page-view/page-view.service';
import { Injectable } from '@angular/core';
import { DotRouterService } from './../../api/services/dot-router-service';
import { CrudService } from './../../api/services/crud/crud.service';

@Injectable()
export class PageViewResolver implements Resolve<any> {
    constructor(
        private crudService: CrudService,
        private dotRouterService: DotRouterService,
        private pageViewService: PageViewService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.getPageView(route.paramMap.get('url'));
    }

    private getPageView(url: string): Observable<any> {
        return this.pageViewService.get(url);
    }
}
