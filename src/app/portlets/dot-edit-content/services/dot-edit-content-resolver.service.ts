import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EditPageService } from '../../../api/services/edit-page/edit-page.service';
import { DotRenderedPage } from '../../dot-edit-page/shared/models/dot-rendered-page.model';

/**
 * With the url return a string of the edit page html
 *
 * @export
 * @class EditContentResolver
 * @implements {Resolve<string>}
 */
@Injectable()
export class EditContentResolver implements Resolve<DotRenderedPage> {
    constructor(private editPageService: EditPageService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DotRenderedPage> {
        return this.editPageService.getEdit(route.queryParams.url);
    }
}
