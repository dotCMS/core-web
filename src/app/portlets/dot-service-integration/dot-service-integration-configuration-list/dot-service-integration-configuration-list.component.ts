import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DotServiceIntegration } from '@shared/models/dot-service-integration/dot-service-integration.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, take } from 'rxjs/operators';
import { DotMessageService } from '@services/dot-messages-service';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';

@Component({
    selector: 'dot-service-integration-configuration-list',
    templateUrl: './dot-service-integration-configuration-list.component.html',
    styleUrls: ['./dot-service-integration-configuration-list.component.scss']
})
export class DotServiceIntegrationConfigurationListComponent implements OnInit {
    @ViewChild('searchInput')
    searchInput: ElementRef;
    messagesKey: { [key: string]: string } = {};
    serviceIntegration: DotServiceIntegration;

    constructor(
        public dotMessageService: DotMessageService,
        private dotAlertConfirmService: DotAlertConfirmService,
        private dotServiceIntegrationService: DotServiceIntegrationService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('integrationService'))
            .subscribe((integration: DotServiceIntegration) => {
                this.serviceIntegration = integration;
            });

        this.dotMessageService
            .getMessages([
                'service.integration.configurations',
                'service.integration.no.configurations',
                'service.integration.key',
                'service.integration.confirmation.title',
                'service.integration.confirmation.message',
                'service.integration.confirmation.accept'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
            });
    }

    createConfiguration(): void {
        console.log('--createConfiguration');
    }

    editConfiguration(configurationId: string): void {
        console.log('--editConfiguration', configurationId);
    }

    deleteConfiguration(configurationId: string): void {
        this.dotAlertConfirmService.confirm({
            accept: () => {
                console.log(
                    '--deleteConfiguration',
                    this.serviceIntegration.serviceKey,
                    configurationId
                );
                this.dotServiceIntegrationService.deleteConfiguration(
                    this.serviceIntegration.serviceKey,
                    configurationId
                );
            },
            reject: () => {},
            header: this.messagesKey['service.integration.confirmation.title'],
            message: this.messagesKey['service.integration.confirmation.message'],
            footerLabel: {
                accept: this.messagesKey['service.integration.confirmation.accept']
            }
        });
    }
}
