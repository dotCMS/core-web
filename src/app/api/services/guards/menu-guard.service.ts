import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DotMenuService } from '../dot-menu.service';
import { DotRouterService } from '../dot-router-service';
import { DotNavigationService } from '../../../view/components/dot-navigation/dot-navigation.service';

@Injectable()
export class MenuGuardService implements CanActivate  {

  constructor(private dotMenuService: DotMenuService,
              private dotRouterService: DotRouterService,
              private dotNavigationService: DotNavigationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.canAccessPortlet(this.dotRouterService.getPortletId(state.url));
    }

    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canAccessPortlet(this.dotRouterService.getPortletId(state.url));
    }

    /**
     * Check if User has access to the requested route (url) based on the Menu, otherwise return to the 'First Portlet'.
     *
     * @param {string} url
     * @returns {boolean}
     */
    canAccessPortlet (url: string): Observable<boolean> {
        return this.dotMenuService.isPortletInMenu(url).map(isValidPortlet => {
            if (isValidPortlet) {
                return isValidPortlet;
            }
            this.dotNavigationService.goToFirstPortlet();
        });
    }
}
