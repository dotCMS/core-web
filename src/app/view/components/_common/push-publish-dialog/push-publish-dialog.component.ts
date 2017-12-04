import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'dot-push-publish-dialog',
    styleUrls: ['./push-publish-dialog.component.scss'],
    templateUrl: 'push-publish-dialog.component.html'
})

export class PushPublishDialogComponent implements OnInit {
    public radioPushButton = 'Push';
    public date: Date;
    @Input() displayDialog = false;
    @Output() cancel = new EventEmitter<boolean>();

    ngOnInit() {
        this.date = new Date;
    }

    close(): boolean {
        this.cancel.emit(true);
        return false;
    }
}
