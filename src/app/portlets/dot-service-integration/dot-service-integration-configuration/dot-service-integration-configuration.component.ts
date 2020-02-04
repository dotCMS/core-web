import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {
    DotServiceIntegration,
    DotServiceIntegrationSites
} from '@shared/models/dot-service-integration/dot-service-integration.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, takeUntil, take, debounceTime } from 'rxjs/operators';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { DotRouterService } from '@services/dot-router/dot-router.service';

import { LazyLoadEvent } from 'primeng/primeng';
import { PaginatorService } from '@services/paginator';

@Component({
    selector: 'dot-service-integration-configuration',
    templateUrl: './dot-service-integration-configuration.component.html',
    styleUrls: ['./dot-service-integration-configuration.component.scss']
})
export class DotServiceIntegrationConfigurationComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput')
    searchInput: ElementRef;
    messagesKey: { [key: string]: string } = {};
    serviceIntegration: DotServiceIntegration;

    disabledLoadDataButton: boolean;
    paginationPerPage = 10;
    totalRecords: number;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotAlertConfirmService: DotAlertConfirmService,
        private dotServiceIntegrationService: DotServiceIntegrationService,
        private dotRouterService: DotRouterService,
        private route: ActivatedRoute,
        public paginationService: PaginatorService
    ) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('data'), takeUntil(this.destroy$))
            .subscribe(([integration, messages]) => {
                this.serviceIntegration = integration;
                this.serviceIntegration.sites = [];
                this.messagesKey = messages;
            });

        observableFromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500))
            .subscribe((keyboardEvent: Event) => {
                this.filterConfigurations(keyboardEvent.target['value']);
            });

        this.paginationService.url = `v1/service-integrations/${this.serviceIntegration.key}`;
        this.paginationService.paginationPerPage = this.paginationPerPage;
        this.paginationService.sortField = 'name';
        this.paginationService.setExtraParams('filter', '');
        this.paginationService.sortOrder = 1;
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    loadData(event?: LazyLoadEvent) {
        this.paginationService
            .getWithOffset((event && event.first) || 0)
            .pipe(take(1), pluck('sites'))
            .subscribe((sites: DotServiceIntegrationSites[]) => {
                this.serviceIntegration.sites = event
                    ? this.serviceIntegration.sites.concat(sites)
                    : sites;
                // this.totalRecords = this.paginationService.totalRecords;
                this.totalRecords = 12;
                this.disabledLoadDataButton = !this.isThereMoreData(
                    this.serviceIntegration.sites.length
                );
            });
    }

    /**
     * Redirects to create configuration page
     *
     * @memberof DotServiceIntegrationConfigurationComponent
     */
    createConfiguration(): void {
        this.dotRouterService.gotoPortlet(
            `/integration-services/${this.serviceIntegration.key}/new`
        );
    }

    /**
     * Redirects to edit configuration page
     *
     * @param MouseEvent $event
     * @param string configurationId
     * @memberof DotServiceIntegrationConfigurationComponent
     */
    editConfiguration(site: DotServiceIntegrationSites): void {
        this.dotRouterService.gotoPortlet(
            `/integration-services/${this.serviceIntegration.key}/edit/${site.id}`
        );
    }

    /**
     * Redirects to add configuration page
     *
     * @memberof DotServiceIntegrationConfigurationComponent
     */
    addConfiguration(): void {
        this.dotRouterService.gotoPortlet(
            `/integration-services/${this.serviceIntegration.key}/create`
        );
    }

    /**
     * Display confirmation dialog to delete a specific configuration
     *
     * @param DotServiceIntegrationSites site
     * @memberof DotServiceIntegrationConfigurationComponent
     */
    deleteConfiguration(site: DotServiceIntegrationSites): void {
        this.dotServiceIntegrationService
            .deleteConfiguration(this.serviceIntegration.key, site.id)
            .pipe(take(1))
            .subscribe(() => {
                this.serviceIntegration.sites = [];
                this.loadData();
            });
    }

    /**
     * Display confirmation dialog to delete all configurations
     *
     * @memberof DotServiceIntegrationConfigurationComponent
     */
    deleteAllConfigurations(): void {
        this.dotAlertConfirmService.confirm({
            accept: () => {
                this.dotServiceIntegrationService
                    .deleteAllConfigurations(this.serviceIntegration.key)
                    .pipe(take(1))
                    .subscribe(() => {
                        this.serviceIntegration.sites = [];
                        this.loadData();
                    });
            },
            reject: () => {},
            header: this.messagesKey['service.integration.confirmation.title'],
            message: this.messagesKey['service.integration.confirmation.delete.all.message'],
            footerLabel: {
                accept: this.messagesKey['service.integration.confirmation.accept']
            }
        });
    }

    private isThereMoreData(index: number): boolean {
        return this.totalRecords / index > 1;
    }

    private filterConfigurations(searchCriteria?: string): void {
        this.paginationService.setExtraParams('filter', searchCriteria);
        this.loadData();
    }
}
