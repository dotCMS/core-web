import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'dot-dialog',
    templateUrl: './dot-dialog.component.html',
    styleUrls: ['./dot-dialog.component.scss']
})
    export class DotDialogComponent {
    @Input() header = '';
    @Input() show: boolean;
    @Input() ok: DotDialogAction;
    @Input() cancel: DotDialogAction;

    @Output() close: EventEmitter<any> = new EventEmitter();

    constructor() {}

    /**
     * Action when pressed Cancel button
     *
     * @memberof DotDialogComponent
     */
    cancelAction(): void {
        this.closeDialog();
        this.cancel.action(this);
    }

    /**
     * Callback when dialog hide
     *
     * @memberof DotDialogComponent
     */
    closeDialog(): void {
        this.show = false;
        this.close.emit();
    }
}

export interface DotDialogAction {
    action: (dialog: any) => void;
    disabled?: boolean;
    label: string;
}
