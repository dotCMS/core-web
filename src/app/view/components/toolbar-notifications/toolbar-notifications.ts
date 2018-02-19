import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';

import { BaseComponent } from '../_common/_base/base-component';
import { DotDropdownComponent } from '../_common/dropdown-component/dot-dropdown.component';
import { DotcmsEventsService, LoginService } from 'dotcms-js/dotcms-js';
import { INotification } from '../../../shared/models/notifications';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { NotificationsService } from '../../../api/services/notifications-service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-toolbar-notifications',
    styleUrls: ['./toolbar-notifications.scss'],
    templateUrl: 'toolbar-notifications.html'
})
export class ToolbarNotificationsComponent extends BaseComponent implements OnInit {
    @ViewChild(DotDropdownComponent) dropdown: DotDropdownComponent;
    existsMoreToLoad = false;
    notifications: Array<INotification> = [];
    notificationsUnreadCount = 0;

    private isNotificationsMarkedAsRead = false;
    private showNotifications = false;

    constructor(
        dotMessageService: DotMessageService,
        public iframeOverlayService: IframeOverlayService,
        private dotcmsEventsService: DotcmsEventsService,
        private loginService: LoginService,
        private notificationService: NotificationsService
    ) {
        super(['notifications_dismissall', 'notifications_title', 'notifications_load_more'], dotMessageService);
    }

    ngOnInit(): void {
        this.getNotifications();
        this.subscribeToNotifications();

        this.loginService.watchUser(this.getNotifications.bind(this));
    }

    dismissAllNotifications(): void {
        const items = this.notifications.map((item) => item.id);
        this.notificationService.dismissNotifications({ items: items }).subscribe((res) => {
            // TODO: I think we should get here res and err
            if (res.errors.length) {
                return;
            }

            this.clearNotitications();
        });
    }

    onDismissNotification($event): void {
        const notificationId = $event.id;

        this.notificationService.dismissNotifications({ items: [notificationId] }).subscribe((res) => {
            if (res.errors.length) {
                return;
            }

            this.notifications = this.notifications.filter((item) => {
                return item.id !== notificationId;
            });

            if (this.notificationsUnreadCount) {
                this.notificationsUnreadCount--;
            }

            if (!this.notifications.length && !this.notificationsUnreadCount) {
                this.clearNotitications();
            }
        });
    }

    loadMore(): void {
        this.notificationService.getAllNotifications().subscribe((res) => {
            this.notificationsUnreadCount = res.entity.count;
            this.notifications = res.entity.notifications;
            this.existsMoreToLoad = false;
        });
    }

    toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;

        if (this.showNotifications && !this.isNotificationsMarkedAsRead) {
            this.markAllAsRead();
        }
    }

    private clearNotitications(): void {
        this.notifications = [];
        this.notificationsUnreadCount = 0;
        this.showNotifications = false;
        this.dropdown.closeIt();
    }

    private getNotifications(): void {
        this.notificationService.getLastNotifications().subscribe((res) => {
            this.notificationsUnreadCount = res.entity.totalUnreadNotifications;
            this.notifications = res.entity.notifications;
            this.existsMoreToLoad = res.entity.total > res.entity.notifications.length;
        });
    }

    private markAllAsRead(): void {
        this.notificationService.markAllAsRead().subscribe(() => {
            this.isNotificationsMarkedAsRead = true;
            this.notificationsUnreadCount = 0;
        });
    }

    private subscribeToNotifications(): void {
        this.dotcmsEventsService.subscribeTo('NOTIFICATION').subscribe((res) => {
            this.notifications.unshift(res.data);
            this.notificationsUnreadCount++;
            this.isNotificationsMarkedAsRead = false;
        });
    }

}
