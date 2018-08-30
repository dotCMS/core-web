import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

import { DotMenu, DotMenuItem } from '../../../shared/models/navigation';
import { DotNavigationService } from './services/dot-navigation.service';

@Component({
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./dot-navigation.component.scss'],
    templateUrl: 'dot-navigation.component.html'
})
export class DotNavigationComponent implements OnInit, OnChanges {
    @Input() collapsed = false;
    @Output() change = new EventEmitter<boolean>();
    menu: DotMenu[];

    constructor(private dotNavigationService: DotNavigationService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.collapsed.currentValue) {
            this.menu = this.menu.map((item: DotMenu) => {
                item.isOpen = false;
                return item;
            });
        }
    }

    ngOnInit() {
        this.dotNavigationService.items$.pipe(take(1)).subscribe((menu: DotMenu[]) => {
            this.menu = menu;
        });

        this.dotNavigationService.onNavigationEnd().subscribe((event: NavigationEnd) => {
            this.setActive(event.url.split('/').pop());
        });
    }

    /**
     * Change or refresh the portlets
     *
     * @param {*} event click event
     * @param {string} id menu item id
     * @memberof MainNavigationComponent
     */
    onClick($event: {originalEvent: MouseEvent, data: DotMenuItem}): void {
        event.stopPropagation();

        if (!$event.originalEvent.ctrlKey && !$event.originalEvent.metaKey) {
            this.dotNavigationService.reloadCurrentPortlet($event.data.id);
        }
    }

    /**
     * Set isOpen to the passed DotMenu item
     *
     * @param {DotMenu} currentItem
     * @memberof DotNavigationComponent
     */
    onMenuClick(event: {originalEvent: MouseEvent, data: DotMenu}): void {
        this.change.emit();

        if (this.collapsed) {
            this.dotNavigationService.goTo(event.data.menuItems[0].menuLink);
        }

        this.menu = this.menu.map((item: DotMenu) => {
            if (item.isOpen) {
                item.isOpen = false;
            } else {
                item.isOpen = event.data.id === item.id;
            }
            return item;
        });
    }

    private setActive(id: string) {
        this.menu = this.menu.map((item: DotMenu) => this.isMenuActive(item, id));
    }

    private isMenuActive(menu: DotMenu, id: string): DotMenu {
        let isActive = false;

        menu.menuItems.forEach((item: DotMenuItem) => {
            if (item.id === id) {
                item.active = true;
                isActive = true;
            } else {
                item.active = false;
            }
        });

        menu.active = isActive;

        return menu;
    }
}
