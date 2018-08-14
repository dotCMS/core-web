import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { CrumbTrailService } from './dot-crumb-trail.service';

/**
 * Route Guard that checks if a User have access to the specified Content Type.
 */
@Injectable()
export class CrumbTrailsGuardService implements CanActivateChild {

    constructor(private crumbTrailService: CrumbTrailService) {}

    canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('CrumbTrailsGuardService', _route, state);
        this.crumbTrailService.push(state.url);
        return true;
    }
}


