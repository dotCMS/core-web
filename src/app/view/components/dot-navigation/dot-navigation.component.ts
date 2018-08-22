import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotMenu } from '../../../shared/models/navigation';
import { DotNavigationService } from './dot-navigation.service';
import { CrumbTrailService } from '../_common/dot-crumb-trail/services/dot-crumb-trail.service';
import { DotRouterService } from '../../../api/services/dot-router/dot-router.service';


@Component({
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./dot-navigation.component.scss'],
    templateUrl: 'dot-navigation.component.html'
})
export class DotNavigationComponent implements OnInit {
    menu: Observable<DotMenu[]>;

    constructor(
        private dotNavigationService: DotNavigationService,
        private crumbTrailService: CrumbTrailService,
        private dotRouterService: DotRouterService
    ) {}

    ngOnInit() {
        this.menu = this.dotNavigationService.items$;
    }

    /**
     * Change or refresh the portlets
     *
     * @param {*} event click event
     * @param {string} id menu item id
     * @memberof MainNavigationComponent
     */
    onClick(event: MouseEvent, menuId: string): void {
        event.stopPropagation();
        if (!this.isMetaKeyPress(event)) {
            this.dotNavigationService.reloadCurrentPortlet(menuId);

            if (this.dotRouterService.currentPortlet.id !== menuId) {
                this.crumbTrailService.clean();
            }
        }
    }

    /**
     * Check is the portlet in the nav is active.
     *
     * @param {string} id
     * @returns
     * @memberof DotNavigationComponent
     */
    isActive(id: string) {
        return this.dotNavigationService.isActive(id);
    }

    private isMetaKeyPress(event: MouseEvent): boolean {
        return event.ctrlKey && event.metaKey;
    }
}
