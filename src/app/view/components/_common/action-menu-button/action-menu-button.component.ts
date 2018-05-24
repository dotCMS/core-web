import { Component, Input, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { MenuItem, Menu } from 'primeng/primeng';
import { DotDataTableAction } from '../../../../shared/models/data-table/dot-data-table-action';

/**
 * The ActionMenuButtonComponent is a configurable button with
 * menu component as a pop up
 * @export
 * @class ActionMenuButtonComponent
 */
@Component({
    selector: 'dot-action-menu-button',
    styleUrls: ['./action-menu-button.component.scss'],
    templateUrl: 'action-menu-button.component.html'
})
export class ActionMenuButtonComponent implements OnInit {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
    @Input() item: any;
    @Input() icon? = 'fa-ellipsis-v';
    @Input() actions?: DotDataTableAction[];

    filteredActions: MenuItem[] = [];
    private menuComponent: Menu;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        this.filteredActions = this.actions
            .filter((action: DotDataTableAction) => (action.shouldShow ? action.shouldShow(this.item) : true))
            .map((action: DotDataTableAction) => {
                return {
                    ...action.menuItem,
                    command: ($event) => {
                        action.menuItem.command(this.item);

                        $event = $event.originalEvent || $event;
                        $event.stopPropagation();
                    }
                };
            });
    }

    /**
     * Create and inject the menu component on mouse enter;
     *
     * @memberof ActionMenuButtonComponent
     */
    createMenu(): void {
        if (!this.menuComponent) {
            const menu: ComponentFactory<Menu> = this.componentFactoryResolver.resolveComponentFactory(Menu);
            const menuEl: ComponentRef<Menu> = this.container.createComponent(menu);
            this.menuComponent = menuEl.instance;
            this.menuComponent.model = this.filteredActions;
            this.menuComponent.appendTo = 'body';
            this.menuComponent.popup = true;
        }
    }

    /**
     * Handle click on the button
     *
     * @param {MouseEvent} $event
     * @memberof ActionMenuButtonComponent
     */
    onClick($event: MouseEvent): void {
        this.menuComponent.toggle($event);
    }
}
