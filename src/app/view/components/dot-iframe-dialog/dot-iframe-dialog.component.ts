import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'dot-iframe-dialog',
    templateUrl: './dot-iframe-dialog.component.html',
    styleUrls: ['./dot-iframe-dialog.component.scss']
})
export class DotIframeDialogComponent implements OnInit, OnChanges {
    @Input() url: string;
    @Output() close: EventEmitter<any> = new EventEmitter();
    @Output() load: EventEmitter<any> = new EventEmitter();
    @Output() keydown: EventEmitter<KeyboardEvent> = new EventEmitter();

    dialogSize: any;
    show: boolean;

    constructor() {}

    ngOnInit() {
        this.setDialogSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.show = !!changes.url.currentValue;
    }

    /**
     * Callback when dialog hide
     *
     * @memberof DotIframeDialogComponent
     */
    closeDialog(): void {
        this.url = null;
        this.show = false;
        this.close.emit();
    }

    /**
     * Handle keydown event from the iframe window
     *
     * @param {any} $event
     * @memberof DotIframeDialogComponent
     */
    onKeyDown($event: KeyboardEvent): void {
        this.keydown.emit($event);

        if ($event.key === 'Escape') {
            this.closeDialog();
        }
    }

    /**
     * Handle load event from the iframe window
     *
     * @param {*} $event
     * @memberof DotIframeDialogComponent
     */
    onLoad($event: any): void {
        $event.target.contentWindow.focus();
        this.load.emit($event);
    }

    private setDialogSize(): void {
        this.dialogSize = {
            width: window.innerWidth - 200,
            height: window.innerHeight - 100
        };
    }
}
