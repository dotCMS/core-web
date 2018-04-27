import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { DotEditContentComponent } from '../../../content/dot-edit-content.component';

@Injectable()
export class DotEditLayoutDeactivateGuardService implements CanDeactivate<DotEditContentComponent> {
    constructor() {}

    canDeactivate(component: DotEditContentComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return component.canDeactivate();
    }
}
