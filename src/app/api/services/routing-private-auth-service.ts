import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DotNavigationService } from './dot-navigation.service';
import { Observable, Observer } from 'rxjs/Rx';
import { DotcmsConfig, LoginService } from 'dotcms-js/dotcms-js';
import { DotRouterService } from './dot-router-service';

@Injectable()
export class RoutingPrivateAuthService implements CanActivate {
    constructor(
        private dotRouterService: DotRouterService,
        private dotNavigationService: DotNavigationService,
        private loginService: LoginService,
        private dotcmsConfig: DotcmsConfig
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.loginService.isLogin$.do(isLogin => {
            if (!isLogin) {
                this.dotRouterService.goToLogin();
            } else if (state.url === '/') {
                this.dotNavigationService.goToFirstPortlet();
            }
            return isLogin;
        });
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.dotNavigationService.isPortletInMenu(this.dotRouterService.getPortletId(state.url))
            .defaultIfEmpty(false)
            .map(res => {
                if (!res) {
                    this.dotNavigationService.goToFirstPortlet();
                }
                return res;
            });

    }
}
