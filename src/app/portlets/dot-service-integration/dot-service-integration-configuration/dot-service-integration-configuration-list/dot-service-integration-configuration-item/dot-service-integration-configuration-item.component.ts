import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DotServiceIntegrationSites } from '@shared/models/dot-service-integration/dot-service-integration.model';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';

import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-service-integration-configuration-item',
    templateUrl: './dot-service-integration-configuration-item.component.html',
    styleUrls: ['./dot-service-integration-configuration-item.component.scss']
})
export class DotServiceIntegrationConfigurationItemComponent implements OnInit {
    @Input() site: DotServiceIntegrationSites;

    @Output() goto = new EventEmitter<DotServiceIntegrationSites>();
    @Output() delete = new EventEmitter<DotServiceIntegrationSites>();

    messagesKey: { [key: string]: string } = {};

    constructor(
        public dotMessageService: DotMessageService,
        private dotAlertConfirmService: DotAlertConfirmService
    ) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'service.integration.key',
                'service.integration.confirmation.title',
                'service.integration.confirmation.delete.message',
                'service.integration.confirmation.accept'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
            });
    }

    /**
     * Emits action to go to configuration page
     *
     * @param MouseEvent $event
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationItemComponent
     */
    gotoConfigurationSite($event: MouseEvent, site?: DotServiceIntegrationSites): void {
        $event.stopPropagation();
        this.goto.emit(site);
    }

    /**
     * Display confirmation dialog to delete a specific configuration
     *
     * @param MouseEvent $event
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationItemComponent
     */
    confirmDelete($event: MouseEvent, site: DotServiceIntegrationSites): void {
        $event.stopPropagation();
        this.dotAlertConfirmService.confirm({
            accept: () => {
                this.delete.emit(site);
            },
            reject: () => {},
            header: this.messagesKey['service.integration.confirmation.title'],
            message: `${this.messagesKey['service.integration.confirmation.delete.message']} <b>${site.name}</b> ?`,
            footerLabel: {
                accept: this.messagesKey['service.integration.confirmation.accept']
            }
        });
    }
}
