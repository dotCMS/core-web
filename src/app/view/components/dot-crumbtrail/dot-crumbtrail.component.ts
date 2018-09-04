import { Component, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';

import { DotMenu, DotMenuItem } from '../../../shared/models/navigation';
import { DotNavigationService } from '../dot-navigation/services/dot-navigation.service';

@Component({
    selector: 'dot-crumbtrail',
    templateUrl: './dot-crumbtrail.component.html',
    styleUrls: ['./dot-crumbtrail.component.scss']
})
export class DotCrumbtrailComponent implements OnInit {
    crumb: Observable<string>;

    constructor(public dotNavigationService: DotNavigationService) {}

    ngOnInit() {
        this.crumb = this.dotNavigationService.onNavigationEnd().pipe(
            map((event: NavigationEnd) => event.url),
            map(this.getMenuItem),
            switchMap(this.getCrumbtrail.bind(this))
        );
    }

    private getMenuItem(url: string): string {
        return url.split('/').filter((section: string) => section !== '' && section !== 'c').join('');
    }

    private getMenuSection(section: string, dotMenus: DotMenu[]): string[] {
        let res = [];

        dotMenus.forEach((menu: DotMenu) => {
            menu.menuItems.forEach((menuItem: DotMenuItem) => {
                if (menuItem.id === section) {
                    res = [menu.name, menuItem.label];
                }
            });
        });

        return res;
    }

    private getCrumbtrail(section: string): Observable<string> {
        return this.dotNavigationService._items$.pipe(
            map((dotMenus: DotMenu[]) => this.getMenuSection(section, dotMenus).join(' > '))
        );
    }
}
