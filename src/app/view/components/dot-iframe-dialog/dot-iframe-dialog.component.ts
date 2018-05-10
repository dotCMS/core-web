import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'dot-iframe-dialog',
    templateUrl: './dot-iframe-dialog.component.html',
    styleUrls: ['./dot-iframe-dialog.component.scss']
})
export class DotIframeDialogComponent implements OnInit, OnChanges {
    @Input() url: string;
    @Output() close: EventEmitter<boolean> = new EventEmitter();
    dialogSize: any;
    safeUrl: SafeResourceUrl;
    show: boolean;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.setDialogSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.url.currentValue) {
            this.show = true;
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        } else {
            this.show = false;
            this.safeUrl = null;
        }
    }

    /**
     * Callback when dialog hide
     *
     * @memberof DotIframeDialogComponent
     */
    closeDialog(): void {
        this.show = false;
        this.safeUrl = null;
        this.close.emit();
    }

    private setDialogSize(): void {
        this.dialogSize = {
            width: window.innerWidth - 200,
            height: window.innerHeight - 100
        };
    }
}
