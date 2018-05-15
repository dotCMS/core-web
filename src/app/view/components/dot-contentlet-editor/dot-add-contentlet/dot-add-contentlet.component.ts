import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DotContentletEditorService } from '../services/dot-add-contentlet.service';

@Component({
    selector: 'dot-add-contentlet',
    templateUrl: './dot-add-contentlet.component.html',
    styleUrls: ['./dot-add-contentlet.component.scss']
})
export class DotAddContentletComponent implements OnInit {
    @Output() load: EventEmitter<any> = new EventEmitter();
    url: Observable<string>;

    constructor(private dotContentletEditorService: DotContentletEditorService) {}

    ngOnInit() {
        this.url = this.dotContentletEditorService.add$;
    }

    /**
     * Handle close dialog event
     *
     * @memberof DotAddContentletComponent
     */
    onClose(): void {
        this.dotContentletEditorService.clear();
    }

    /**
     * Handle the custome events from the DotDialogIframe component
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onCustomEvent($event) {
        if ($event.detail.name === 'close') {
            this.onClose();
        }
    }

    /**
     * Call the keyDown method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onKeyDown($event): void {
        if (this.dotContentletEditorService.keyDown) {
            this.dotContentletEditorService.keyDown($event);
        }
    }

    /**
     * Call the load method from the service if exist
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onLoad($event): void {
        if (this.dotContentletEditorService.load) {
            this.dotContentletEditorService.load($event);
        }
    }
}
