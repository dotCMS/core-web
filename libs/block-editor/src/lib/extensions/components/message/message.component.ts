import { Component, ViewEncapsulation } from '@angular/core';
import { AngularNodeViewComponent } from '../../../NodeViewRenderer';

export const enum MessageType {
    INFO = 'info',
    ERROR = 'error'
}

@Component({
    selector: 'dotcms-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MessageComponent extends AngularNodeViewComponent {
    data: {
        type: MessageType;
        message: string;
    };
}
