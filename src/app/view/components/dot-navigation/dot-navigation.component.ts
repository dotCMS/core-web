import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DotMenu, DotMenuItem } from '@models/navigation';
import { DotNavigationService } from './services/dot-navigation.service';


@Component({
    providers: [],
    selector: 'dot-main-nav',
    styleUrls: ['./dot-navigation.component.scss'],
    templateUrl: 'dot-navigation.component.html'
})
export class DotNavigationComponent implements OnInit {
    menu$: Observable<DotMenu[]>;
    clicks: number = 0; 
    hovering: String = null;
    constructor(public dotNavigationService: DotNavigationService) {}

    ngOnInit() {
        this.menu$ = this.dotNavigationService.items$;
    }

    /**
     * Change or refresh the portlets
     *
     * @param * event click event
     * @param string id menu item id
     * @memberof MainNavigationComponent
     */
    onItemClick($event: { originalEvent: MouseEvent; data: DotMenuItem }): void {
        $event.originalEvent.stopPropagation();

        if (!$event.originalEvent.ctrlKey && !$event.originalEvent.metaKey) {
            this.dotNavigationService.reloadCurrentPortlet($event.data.id);
        }
        if(this.dotNavigationService.getCollapseAfterNavigating){
            this.dotNavigationService.toggle();
        }
    }

    /**
     * Opens the menu on single click
     *
     * @param DotMenu currentItem
     * @memberof DotNavigationComponent
     */
    onMenuClick(event: { originalEvent: MouseEvent; data: DotMenu }): void {
        //
        if (this.dotNavigationService.collapsed) {
            this.dotNavigationService.goTo(event.data.menuItems[0].menuLink);
        }else{
            this.dotNavigationService.setOpen(event.data.id);
        }
    }



    onMenuHover(event: { originalEvent: MouseEvent; data: DotMenu }): void {
        event.originalEvent.stopImmediatePropagation;
        if (this.dotNavigationService.collapsed) {
            console.log("hover:" + event.data.name)
        }

    }
    onMenuOut(event: { originalEvent: MouseEvent; data: DotMenu }): void {
        event.originalEvent.stopImmediatePropagation;
        if (this.dotNavigationService.collapsed) {
            console.log("out:" + event.data.name)
        }
    }

     /**
     * Opens the menu but does not navigate when
     * double-clicked
     *
     * @param DotMenu currentItem
     * @memberof DotNavigationComponent
     */
    onRightClick(event: { originalEvent: MouseEvent; data: DotMenu }): void {
        
        if (this.dotNavigationService.collapsed) {
            this.dotNavigationService.setOpen(event.data.id);
            this.dotNavigationService.setCollapseAfterNavigating(true);
        }else{
          
            this.onMenuClick(event);
        }
    }

}
