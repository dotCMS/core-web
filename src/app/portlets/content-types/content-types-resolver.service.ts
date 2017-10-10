import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CrudService } from '../../api/services/crud';
import { ContentType, CONTENT_TYPE_INITIAL_DATA } from './shared/content-type.model';
import { ContentTypesInfoService } from '../../api/services/content-types-info';
import { LoginService } from 'dotcms-js/dotcms-js';

@Injectable()
export class ContentTypeResolver implements Resolve<ContentType> {
    constructor(
        private contentTypesInfoService: ContentTypesInfoService,
        private crudService: CrudService,
        private loginService: LoginService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContentType> {
        if (route.paramMap.get('id')) {
            return this.crudService
                .getDataById('v1/contenttype', route.paramMap.get('id'))
                .take(1)
                .map((contentType: ContentType) => {
                    if (contentType) {
                        return contentType;
                    } else {
                        this.router.navigate(['/content-types-angular']);
                        return null;
                    }
                });
        } else {
            const type = route.paramMap.get('type').toUpperCase();
            return Observable.of(
                Object.assign({}, CONTENT_TYPE_INITIAL_DATA, {
                    owner: this.loginService.auth.user.userId,
                    baseType: type,
                    clazz: this.contentTypesInfoService.getClazz(type)
                })
            );
        }
    }
}
