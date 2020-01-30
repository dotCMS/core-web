import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {
    DotServiceIntegration,
    DotServiceIntegrationSites
} from '@shared/models/dot-service-integration/dot-service-integration.model';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';

import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    selector: 'dot-service-integration-configuration-list',
    templateUrl: './dot-service-integration-configuration-list.component.html',
    styleUrls: ['./dot-service-integration-configuration-list.component.scss']
})
export class DotServiceIntegrationConfigurationListComponent implements OnInit {
    @ViewChild('searchInput')
    searchInput: ElementRef;

    @Input() siteConfigurations: DotServiceIntegrationSites[];
    @Input() lazyCars: any[];
    @Input() totalRecords: number;

    @Output() lazyLoad = new EventEmitter<LazyLoadEvent>();

    messagesKey: { [key: string]: string } = {};
    serviceIntegration: DotServiceIntegration;

    constructor(private dotAlertConfirmService: DotAlertConfirmService) {}

    ngOnInit() {
        console.log('****siteConfigurations', this.siteConfigurations, this.totalRecords);
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.lazyLoad.emit(event);
    }

    /**
     * Redirects to edit configuration page
     *
     * @param MouseEvent $event
     * @param string configurationId
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    editConfiguration($event: MouseEvent, _configurationId: string): void {
        $event.stopPropagation();
        // this.dotRouterService.gotoPortlet(
        //     `/integration-services/${this.serviceIntegration.key}/edit/${configurationId}`
        // );
    }

    /**
     * Display confirmation dialog to delete a specific configuration
     *
     * @param MouseEvent $event
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    deleteConfiguration($event: MouseEvent, site: DotServiceIntegrationSites): void {
        $event.stopPropagation();
        this.dotAlertConfirmService.confirm({
            accept: () => {
                // this.dotServiceIntegrationService
                //     .deleteConfiguration(this.serviceIntegration.key, site.id)
                //     .pipe(take(1))
                //     .subscribe(() => this.getConfiguration());
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
