import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PaginatorService } from '@services/paginator';
import { DotTemplate } from '@models/dot-edit-layout-designer';

@Injectable({
    providedIn: 'root'
})
export class DotTemplateListResolver implements Resolve<DotTemplate[]> {
    constructor(public paginatorService: PaginatorService) {}

    resolve(): Observable<DotTemplate[]> {
        this.paginatorService.url = '/api/v1/templates';
        return this.paginatorService.getFirstPage().pipe(take(1));
    }
}
