import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LoginService } from 'dotcms-js/dotcms-js';
import { DotRouterService } from './../dot-router-service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private dotRouterService: DotRouterService,
        private loginService: LoginService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.loginService.isLogin$.do(isLogin => {
            if (isLogin) {
                return isLogin;
            }else {
                this.dotRouterService.goToLogin();
            }
        });
    }
}
