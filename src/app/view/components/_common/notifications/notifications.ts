import {BaseComponent} from '../_base/base-component';
import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {INotification} from '../../../../api/services/notifications-service';
import {MessageService} from '../../../../api/services/messages-service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [],
    selector: 'dot-notifications-item',
    styles: [require('./notifications-item.scss')],
    templateUrl: 'notifications-item.html',

})
export class NotificationsItem extends BaseComponent {
    @Input() data;
    @Output() clear = new EventEmitter<Object>();

    private notificationIcons: Object = {
        ERROR: 'exclamation-triangle',
        INFO: 'info-circle',
        WARNING: 'ban',
    };
    private showLinkAction = false;
    private showTitleLinked = false;

    constructor(messageService: MessageService) {
        super(['notifications_dismiss'], messageService);
    }

    ngOnInit(): void {
        // TODO: hand more than one action
        let actions = this.data.actions ? this.data.actions[0] : null;
        this.showLinkAction = actions && actions.actionType === 'LINK' &&
            (actions.text || actions.text !== '') && actions.action && actions.action !== '';

        this.showTitleLinked = actions && actions.actionType === 'LINK'
            && (!actions.text || actions.text === '') && actions.action && actions.action !== '';
    }

    getIconName(val: string): string {
        return 'notification-item__icon fa fa-' + this.notificationIcons[val];
    }

    onClear(): void {
        this.clear.emit({
            id: this.data.id
        });
    }
}

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    providers: [],
    selector: 'dot-notifications-list',
    styles: [require('./notifications-list.scss')],
    templateUrl: 'notifications-list.html',
})
export class NotificationsList {
    @Input() notifications: INotification;
    @Output() dismissNotification = new EventEmitter<Object>();

    constructor() {}

    onClearNotification($event): void {
        this.dismissNotification.emit($event);
    }
}