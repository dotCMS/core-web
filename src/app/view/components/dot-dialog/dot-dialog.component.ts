import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'dot-dialog',
    templateUrl: './dot-dialog.component.html'
})
export class DotDialogComponent {
    @Input() header = '';
    @Input() show: boolean;
    @Input() ok: Action;
    @Input() cancel: Action;

    @Output() close: EventEmitter<any> = new EventEmitter();

    constructor() {}

    /**
     * Callback when dialog hide
     *
     * @memberof DotIframeDialogComponent
     */
    closeDialog(): void {
        this.show = false;
        this.close.emit();
    }
}

export interface Action {
    label: string;
    action: () => void;
}
