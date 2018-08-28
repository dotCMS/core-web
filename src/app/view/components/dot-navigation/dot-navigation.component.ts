import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { DotMenu } from '../../../shared/models/navigation';
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
export class DotNavigationComponent implements OnInit {
    menu: DotMenu[];

    constructor(private dotNavigationService: DotNavigationService) {}

    ngOnInit() {
        this.dotNavigationService.items$.pipe(take(1)).subscribe((menu: DotMenu[]) => {
            this.menu = menu;
        });
    }

    /**
     * Change or refresh the portlets
     *
     * @param {*} event click event
     * @param {string} id menu item id
     * @memberof MainNavigationComponent
     */
    onClick(event: MouseEvent, id: string): void {
        event.stopPropagation();
        if (!event.ctrlKey && !event.metaKey) {
            this.dotNavigationService.reloadCurrentPortlet(id);
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

    expand(currentItem: DotMenu): void {
        this.menu = this.menu.map((item: DotMenu) => {
            item.isOpen = currentItem.id === item.id;
            return item;
        });
    }
}
