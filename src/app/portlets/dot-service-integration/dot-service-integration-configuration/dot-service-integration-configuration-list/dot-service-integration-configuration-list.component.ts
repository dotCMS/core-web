import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { DotServiceIntegrationSites } from '@shared/models/dot-service-integration/dot-service-integration.model';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';

import { LazyLoadEvent } from 'primeng/primeng';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-service-integration-configuration-list',
    templateUrl: './dot-service-integration-configuration-list.component.html',
    styleUrls: ['./dot-service-integration-configuration-list.component.scss']
})
export class DotServiceIntegrationConfigurationListComponent implements OnInit {
    @ViewChild('searchInput')
    searchInput: ElementRef;

    @Input() disabledLoadDataButton: boolean;
    @Input() itemsPerPage: number;
    @Input() siteConfigurations: DotServiceIntegrationSites[];

    @Output() loadData = new EventEmitter<LazyLoadEvent>();
    @Output() addConfiguration = new EventEmitter<boolean>();
    @Output() editConfiguration = new EventEmitter<DotServiceIntegrationSites>();
    @Output() deleteConfiguration = new EventEmitter<DotServiceIntegrationSites>();

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
                'service.integration.confirmation.accept',
                'service.integration.configurations.show.more'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messagesKey = messages;
            });
    }

    /**
     * Emits action to load next configuration page
     *
     * @param MouseEvent $event
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    loadNext() {
        this.loadData.emit({ first: this.siteConfigurations.length, rows: this.itemsPerPage });
    }

    /**
     * Emits action to edit configuration page
     *
     * @param MouseEvent $event
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    editConfigurationSite($event: MouseEvent, site: DotServiceIntegrationSites): void {
        $event.stopPropagation();
        this.editConfiguration.emit(site);
    }

    /**
     * Emits action to add configuration page
     *
     * @param MouseEvent $event
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    addConfigurationSite($event: MouseEvent): void {
        $event.stopPropagation();
        this.addConfiguration.emit(true);
    }

    /**
     * Display confirmation dialog to delete a specific configuration
     *
     * @param MouseEvent $event
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    confirmDelete($event: MouseEvent, site: DotServiceIntegrationSites): void {
        $event.stopPropagation();
        this.dotAlertConfirmService.confirm({
            accept: () => {
                this.deleteConfiguration.emit(site);
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
