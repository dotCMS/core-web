import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ContentletService } from './contentlet.service';
import { DotNavigationService } from '../../view/components/dot-navigation/dot-navigation.service';

@Injectable()
export class RoutingContentletAuthService implements CanActivateChild {
    constructor(
        private contentletService: ContentletService,
        private dotNavigationService: DotNavigationService
    ) {}

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.contentletService.isContentTypeInMenu(route.params.id).map(res => {
            if (!res) {
                this.dotNavigationService.goToFirstPortlet();
            }
            return res;
        });
    }
}
