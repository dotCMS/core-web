import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { DotRole } from '@models/dot-role/dot-role.model';
import { RequestMethod } from '@angular/http';
import { pluck } from 'rxjs/operators';

@Injectable()
export class DotRolesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Return list of roles associated to specific role .
     * @param {string} roleId
     * @returns Observable<DotRole[]>
     * @memberof DotRolesService
     */
    get(roleId: string): Observable<DotRole[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `/api/role/users/id/${roleId}`
            })
            .pipe(pluck('entity'));
    }
}
