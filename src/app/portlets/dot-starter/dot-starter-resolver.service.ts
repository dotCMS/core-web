import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
    DotCurrentUserService,
    PermissionsType,
    UserPermissions
} from '@services/dot-current-user/dot-current-user.service';
import { DotCurrentUser, DotPermissionsType } from '@models/dot-current-user/dot-current-user';
import { map, mergeMap } from 'rxjs/operators';

/**
 * Returns user's data and permissions
 *
 * @export
 * @class DotStarterResolver
 * @implements {Resolve<Observable<[DotCurrentUser, DotPermissionsType]>>}
 */
@Injectable()
export class DotStarterResolver
    implements Resolve<Observable<[DotCurrentUser, DotPermissionsType]>> {
    constructor(private dotCurrentUserService: DotCurrentUserService) {}

    resolve(): Observable<[DotCurrentUser, DotPermissionsType]> {
        return this.dotCurrentUserService.getCurrentUser().pipe(
            map((user: DotCurrentUser) => {
                return this.dotCurrentUserService
                    .getUserPermissions(
                        user.userId,
                        [UserPermissions.WRITE],
                        [
                            PermissionsType.HTMLPAGES,
                            PermissionsType.TEMPLATES,
                            PermissionsType.CONTENTLETS
                        ]
                    )
                    .pipe(
                        map((permissionsType: DotPermissionsType[]) => {
                            return [user, permissionsType[0]];
                        })
                    );
            }),
            mergeMap((data: Observable<[DotCurrentUser, DotPermissionsType]>) => data)
        );
    }
}
