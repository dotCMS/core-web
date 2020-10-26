import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { Observable } from 'rxjs';

@Injectable()
export class DotTemplateDesignerResolver implements Resolve<any> {
    constructor(private service: DotTemplatesService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.service.getByInode(route.paramMap.get('inode'));
    }
}
