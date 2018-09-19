import { Injectable } from '@angular/core';
import { DotNavigationService } from '../../dot-navigation/services/dot-navigation.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { DotMenu, DotMenuItem } from '../../../../shared/models/navigation';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DotCrumbtrailService {
    private URL_EXCLUDES = ['/content-types-angular/create/content'];
    private crumbTrail: Observable<string>;

    constructor(public dotNavigationService: DotNavigationService) {
        this.crumbTrail = this.dotNavigationService.onNavigationEnd().pipe(
            map((event: NavigationEnd) => {
                console.log('event', event);
                return event.url;
            }),
            filter((url: string) => !this.URL_EXCLUDES.includes(url)),
            switchMap(this.getCrumbtrail.bind(this))
        );
    }

    get crumbTrail$(): Observable<string> {
        return this.crumbTrail;
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

    private getCrumbtrail(url: string): Observable<string> {
        const sections: string[] = this.splitURL(url);
        const portletId = sections[0];

        return this.dotNavigationService.items$.pipe(
            map((dotMenus: DotMenu[]) => {
                return [
                    ...this.getPortletLabel(portletId, dotMenus),
                    ...this.URL_EXCLUDES.includes(url) ?
                        [] : this.getCrumbtrailSection(sections.slice(1))].join(' > ');
            })
        );
    }
}
