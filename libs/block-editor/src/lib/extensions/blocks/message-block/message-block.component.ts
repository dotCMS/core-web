import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularNodeViewComponent } from '@dotcms/block-editor';

export const enum MessageType {
    INFO = 'info',
    ERROR = 'error'
}

@Component({
    selector: 'dotcms-message-block',
    templateUrl: './message-block.component.html',
    styleUrls: ['./message-block.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MessageBlockComponent extends AngularNodeViewComponent implements OnInit {
    data: {
        type: MessageType;
        message: string;
    };

    ngOnInit(): void {
        this.data = this.node.attrs.data;
    }
}
