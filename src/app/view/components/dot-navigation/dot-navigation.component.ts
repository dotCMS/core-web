import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavigationEnd } from '@angular/router';

import { DotMenu, DotMenuItem } from '../../../shared/models/navigation';
import { DotNavigationService } from './services/dot-navigation.service';

@Component({
    animations: [
        trigger('expandAnimation', [
            state(
                'expanded',
                style({
                    height: '*',
                    overflow: 'hidden'
                })
            ),
            state(
                'collapsed',
                style({
                    height: '0px',
                    overflow: 'hidden'
                })
            ),
            transition('expanded <=> collapsed', animate('250ms ease-in-out'))
        ])
    ],
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
    onClick(event: MouseEvent, menuItem: DotMenuItem): void {
        event.stopPropagation();

        if (!event.ctrlKey && !event.metaKey) {
            this.dotNavigationService.reloadCurrentPortlet(menuItem.id);
        }
    }

    /**
     * Set isOpen to the passed DotMenu item
     *
     * @param {DotMenu} currentItem
     * @memberof DotNavigationComponent
     */
    expand(menu: DotMenu): void {
        if (this.collapsed) {
            this.dotNavigationService.goTo(menu.menuItems[0].menuLink);
        }
        this.change.emit();

        this.menu = this.menu.map((item: DotMenu) => {
            item.isOpen = menu.id === item.id;
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
