import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'dot-iframe-dialog',
    templateUrl: './dot-iframe-dialog.component.html',
    styleUrls: ['./dot-iframe-dialog.component.scss']
})
export class DotIframeDialogComponent implements OnInit, OnChanges {
    @Input() url: string;
    @Output() close: EventEmitter<boolean> = new EventEmitter();
    @Output() load: EventEmitter<boolean> = new EventEmitter();

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

    private setDialogSize(): void {
        this.dialogSize = {
            width: window.innerWidth - 200,
            height: window.innerHeight - 100
        };
    }
}
