import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-reorder-menu',
    templateUrl: './dot-reorder-menu.component.html'
})
export class DotReorderMenuComponent implements OnInit {
    @Input() url: string;
    @Output() custom: EventEmitter<any> = new EventEmitter();

    constructor(
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.dotMessageService.getMessages([
            'editpage.content.contentlet.menu.reorder.title'
        ]).subscribe();
    }

    /**
     * Handle close event form the iframe
     *
     * @memberof DotContentletWrapperComponent
     */
    onClose(): void {
        console.log('---onClose()');
        this.custom.emit('cancel-save-menu-order');
    }

    /**
     * Handle the custome events from the DotDialogIframe component
     *
     * @param {any} $event
     * @memberof DotAddContentletComponent
     */
    onCustomEvent($event) {
        console.log('--$event custom', $event);
        this.custom.emit($event.detail.name);
    }

}
