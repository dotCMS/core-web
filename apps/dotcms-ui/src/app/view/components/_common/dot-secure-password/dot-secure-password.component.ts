import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotDialogActions } from '../../dot-dialog/dot-dialog.component';

@Component({
    templateUrl: './dot-secure-password.component.html'
    // styleUrls: ['./dot-download-bundle-dialog.component.scss']
})
export class DotSecurePasswordComponent implements OnInit {
    @Input() data: { [key: string]: any };
    @Output() event = new EventEmitter<DotSecurePasswordComponent>();
    @Output() dialogActions = new EventEmitter<DotDialogActions>();

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit() {
        console.log('----data', this.data);
        this.createDialogActions();
    }

    onEmit() {
        this.event.emit(this);

        const actions = {
            accept: {
                action: () => {
                    this.data.password = 'saved'
                },
                disabled: true,
                label: 'Save2'
            },
        };
        this.dialogActions.emit(actions);
    }

    private createDialogActions() {
        const actions = {
            accept: {
                action: () => {
                    this.data.password = 'saved'
                },
                label: 'Save'
            },
        };
        this.dialogActions.emit(actions);
    }
}
