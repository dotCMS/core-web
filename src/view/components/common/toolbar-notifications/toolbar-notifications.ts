import {BaseComponent} from '../_base/base-component';
import {Component, ViewEncapsulation, ElementRef} from '@angular/core';
import {DotcmsEventsService} from '../../../../api/services/dotcms-events-service';
import {INotification, NotificationsService} from '../../../../api/services/notifications-service';
import {MessageService} from '../../../../api/services/messages-service';
import {LoginService} from '../../../../api/services/login-service';
import {IframeOverlayService} from "../../../../api/services/iframe-overlay-service";
import {LoggerService} from "../../../../api/services/logger.service";

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    moduleId: __moduleName, // REQUIRED to use relative path in styleUrls
    selector: 'dot-toolbar-notifications',
    styleUrls: ['toolbar-notifications.css'],
    templateUrl: ['toolbar-notifications.html']
})
export class ToolbarNotifications extends BaseComponent{
    private elementRef;
    private isNotificationsMarkedAsRead: boolean = false;
    private notifications: Array<INotification> = [];
    private notificationsIdList: Array<boolean> = [];
    private notificationsUnreadCount: number = 0;
    private showNotifications: boolean = false;
    private notificationsQuatity: number = 5;


    constructor(private dotcmsEventsService: DotcmsEventsService, private notificationService: NotificationsService,
                myElement: ElementRef, private messageService: MessageService, private loginService: LoginService,
                private iframeOverlayService: IframeOverlayService, private loggerService: LoggerService) {
        super(['notifications_dismissall', 'notifications_title'], messageService);
        this.elementRef = myElement;
    }

    ngOnInit(): void {
        this.getNotifications();
        this.subscribeToNotifications();

        this.loginService.watchUser(this.getNotifications.bind(this));
    }

    private clearNotitications(): void {
        this.notifications = [];
        this.notificationsIdList = [];
        this.notificationsUnreadCount = 0;
        this.showNotifications = false;
    }

    private dismissAllNotifications(): void {
        let items = this.notifications.map(item => item.id);
        this.notificationService.dismissNotifications({'items': items}).subscribe(res => {
            // TODO: I think we should get here res and err
            if (res.errors.length) {
                return;
            }

            this.clearNotitications();
        });
    }

    private getNotifications(): void {
        this.notificationService.getNotifications().subscribe(res => {

            this.notifications = res.entity.notifications.slice(0, this.notificationsQuatity);
            this.notificationsUnreadCount = this.notifications.length;
            if (this.notifications) {
                for (let i = 0; i < this.notifications.length; ++i) {
                    let notification = this.notifications[i];
                    this.notificationsIdList[notification.id] = true;
                }

                this.loggerService.debug("notificationsIdList", this.notificationsIdList);
            }
        });
    }

    private markAllAsRead(): void {
        this.notificationService.markAllAsRead().subscribe(res => {
            this.isNotificationsMarkedAsRead = true;
            this.notificationsUnreadCount = 0;
        });

    }

    private onDismissNotification($event): void {
        let notificationId = $event.id;

        this.notificationService.dismissNotifications({items: [notificationId]}).subscribe(res => {
            if (res.errors.length) {
                return;
            }

            this.notifications = this.notifications.filter(item => {
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

    private subscribeToNotifications(): void {
        this.dotcmsEventsService.subscribeTo('NOTIFICATION').subscribe((res) => {

            if (!this.notificationsIdList[res.data.id]) {
                this.notifications.unshift(res.data);
                this.notifications = this.notifications.slice(0, this.notificationsQuatity);
                this.notificationsUnreadCount = this.notifications.length;
                this.isNotificationsMarkedAsRead = false;
                this.notificationsIdList[res.data.id] = true;
                this.loggerService.debug("notificationsIdList", this.notificationsIdList);
            }
        });
    }

    private toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;

        if (this.showNotifications && !this.isNotificationsMarkedAsRead) {
            this.markAllAsRead();
        }
    }
}