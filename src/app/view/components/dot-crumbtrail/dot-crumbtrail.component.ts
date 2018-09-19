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
            map((event: NavigationEnd) => {
                console.log('event', event);
                return event.url;
            }),
            map(this.splitURL),
            switchMap(this.getCrumbtrail.bind(this))
        );
    }

    private splitURL(url: string): string[] {
        return url.split('/').filter((section: string) => section !== '' && section !== 'c');
    }

    private getPortletLabel(portletId: string, dotMenus: DotMenu[]): string[] {
        let res;

        dotMenus.forEach((menu: DotMenu) => {
            menu.menuItems.forEach((menuItem: DotMenuItem) => {
                if (menuItem.id === portletId) {
                    res = [menu.name, menuItem.label];
                }
            });
        });

        return res;
    }

    private getCrumbtrailSection(sections: string[]): string[] {
        const res = [];

        sections.forEach(section => {
            res.push(section);
        });

        return res;
    }

    private getCrumbtrail(sections: string[]): Observable<string> {
        const portletId = sections[0];

        return this.dotNavigationService.items$.pipe(
            map((dotMenus: DotMenu[]) => {
                return [
                    ...this.getPortletLabel(portletId, dotMenus),
                    ...this.getCrumbtrailSection(sections.slice(1))].join(' > ');
            })
        );
    }
}
