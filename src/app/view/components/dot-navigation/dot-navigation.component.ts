import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotMenu, DotMenuItem } from '../../../shared/models/navigation';
import { DotNavigationService } from './dot-navigation.service';
import { CrumbTrailService } from '../_common/dot-crumb-trail/services/dot-crumb-trail.service';
import { DotMenuService } from '../../../api/services/dot-menu.service';

@Component({
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./dot-navigation.component.scss'],
    templateUrl: 'dot-navigation.component.html'
})
export class DotNavigationComponent implements OnInit {
    menu: Observable<DotMenu[]>;

    constructor(private dotNavigationService: DotNavigationService,
        private crumbTrailService: CrumbTrailService,
        private menuService: DotMenuService) {}

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
    onClick(event: MouseEvent, menu: DotMenuItem): void {
        event.stopPropagation();
        if (!event.ctrlKey && !event.metaKey) {
            this.dotNavigationService.reloadCurrentPortlet(menu.id);

            this.menuService.getDotMenu(menu.id).subscribe(((parentMenu: DotMenu) => {
                console.log('parentMenu', parentMenu);
                console.log('menu', menu);
                this.crumbTrailService.clean('/', parentMenu.name);
                this.crumbTrailService.push(menu.menuLink, menu.label);
            }));
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
}
