import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DotRouterService } from './../dot-router-service';

/**
 * Route Guard that checks if a User is logged in.
 */
@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private dotRouterService: DotRouterService, private loginService: LoginService) {}

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.loginService.isLogin$.map((isLogin) => {
            if (!isLogin) {
                this.dotRouterService.goToLogin();
            } else if (state.url === '/') {
                if (this.loginService.auth.user['editModeUrl']) {
                    this.dotRouterService.gotoPortlet(`c/site-browser?url=${this.loginService.auth.user['editModeUrl']}`, true);
                    this.loginService.auth.user['editModeUrl'] = null;
                } // else {
                    // this.dotNavigationService.goToFirstPortlet();
                // }
            }
            return isLogin;
        });
    }
}
