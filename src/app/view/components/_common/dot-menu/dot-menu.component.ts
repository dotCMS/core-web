import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';

/**
 * Custom Menu to display options as a pop-up.
 *
 * @export
 * @class DotMenuComponent
 */
@Component({
    selector: 'dot-menu',
    templateUrl: './dot-menu.component.html',
    styleUrls: ['./dot-menu.component.scss']
})
export class DotMenuComponent {
    @Input() icon: string;
    @Input() model: MenuItem[];
    visible = false;
    constructor() {}

    /**
     * Toogle the visibility of the menu options & track
     * a document click when is open to eventually hide the menu
     *
     * @memberof DotMenuComponent
     */
    toggle(): void {
        this.visible = !this.visible;
        if (this.visible) {
            // Skip 1 because the event bubbling capture the document.click
            Observable.fromEvent(document, 'click')
                .skip(1)
                .take(1)
                .subscribe(() => {
                    this.visible = false;
                });
        }
    }

    /**
     * Hanlde the click on the menu items, by executing the command
     * funtion or prevent the default behavior if the item is disable.
     *
     * @param $event
     * @param {MenuItem} item
     *
     * @memberof DotMenuComponent
     */
    itemClick($event, item: MenuItem): void {
        if (item.disabled) {
            $event.preventDefault();
            return;
        }

        if (item.command) {
            item.command({
                originalEvent: $event,
                item: item
            });
        }
        this.visible = false;
    }
}
