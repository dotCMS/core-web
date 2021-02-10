import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotCurrentUser, DotPermissionsType } from '@models/dot-current-user/dot-current-user';
import { map, pluck, take } from 'rxjs/operators';

export enum UserPermissions {
    READ = 'READ',
    WRITE = 'WRITE'
}

export enum PermissionsType {
    HTMLPAGES = 'HTMLPAGES',
    CONTAINERS = 'CONTAINERS',
    FOLDERS = 'FOLDERS',
    LINKS = 'LINKS',
    TEMPLATES = 'TEMPLATES',
    TEMPLATE_LAYOUTS = 'TEMPLATE_LAYOUTS',
    STRUCTURES = 'STRUCTURES',
    CONTENTLETS = 'CONTENTLETS',
    CATEGORY = 'CATEGORY',
    RULES = 'RULES'
}
@Injectable()
export class DotCurrentUserService {
    private currentUsersUrl = 'v1/users/current/';
    private userPermissionsUrl =
        'v1/permissions/_bypermissiontype/userid={0}?permission={1}&permissiontype={2}';
    private porletAccessUrl = 'v1/portlet/{0}/_doesuserhaveaccess';

    constructor(private coreWebService: CoreWebService) {}

    // TODO: We need to update the LoginService to get the userId in the User object
    /**
     * Get logged user and userId.
     * @returns Observable<DotCurrentUser>
     * @memberof DotCurrentUserService
     */
    getCurrentUser(): Observable<DotCurrentUser> {
        return this.coreWebService
            .request({
                url: this.currentUsersUrl
            })
            .pipe(map((res: any) => <DotCurrentUser>res));
    }

    /**
     * Returns User portlet permissions data
     * @param string userId
     * @param UserPermissions[] permissions
     * @param PermissionsType[] permissionsType
     * @returns Observable<DotPermissionsType[]>
     * @memberof DotCurrentUserService
     */
    getUserPermissions(
        userId: string,
        permissions: UserPermissions[] = [],
        permissionsType: PermissionsType[] = []
    ): Observable<DotPermissionsType[]> {
        let permissionsUrl = this.userPermissionsUrl.replace('{0}', userId);
        permissionsUrl = permissionsUrl.replace('{1}', permissions.join(','));
        permissionsUrl = permissionsUrl.replace('{2}', permissionsType.join(','));
        return this.coreWebService
            .requestView({
                url: permissionsUrl
            })
            .pipe(take(1), pluck('entity'));
    }

    /**
     * Verifies if current User has access to a specific portlet Id
     * @param string portletid
     * @returns Observable<boolean>
     * @memberof DotCurrentUserService
     */
    hasAccessToPortlet(portletid: string): Observable<boolean> {
        return this.coreWebService
            .requestView({
                url: this.porletAccessUrl.replace('{0}', portletid)
            })
            .pipe(take(1), pluck('entity', 'response'));
    }
}
