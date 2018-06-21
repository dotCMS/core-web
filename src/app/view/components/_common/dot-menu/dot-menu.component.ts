import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';

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
    }
}
