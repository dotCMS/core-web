import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {
    DotServiceIntegration,
    DotServiceIntegrationSites
} from '@shared/models/dot-service-integration/dot-service-integration.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, takeUntil, take } from 'rxjs/operators';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';
import { Subject } from 'rxjs';
import { DotRouterService } from '@services/dot-router/dot-router.service';

import { LazyLoadEvent } from 'primeng/primeng';

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

    // demo *-*-*-*-*-*-*-*-* START
    cars: any[] = [];
    brands: string[];
    colors: string[];
    lazyCars: any[];
    totalLazyCarsLength: number;
    sortOptions: any[];
    timeout: any;
    // demo *-*-*-*-*-*-*-*-* END

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotAlertConfirmService: DotAlertConfirmService,
        private dotServiceIntegrationService: DotServiceIntegrationService,
        private dotRouterService: DotRouterService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('data'), takeUntil(this.destroy$))
            .subscribe(([integration, messages]) => {
                this.serviceIntegration = integration;
                this.messagesKey = messages;
            });

        // demo *-*-*-*-*-*-*-*-* START
        this.brands = [
            'Audi',
            'BMW',
            'Fiat',
            'Ford',
            'Honda',
            'Jaguar',
            'Mercedes',
            'Renault',
            'Volvo',
            'VW'
        ];

        this.colors = ['Black', 'White', 'Red', 'Blue', 'Silver', 'Green', 'Yellow'];

        for (let i = 0; i < 10000; i++) {
            this.cars.push(this.generateCar());
        }

        this.totalLazyCarsLength = 10000;
        this.sortOptions = [
            { label: 'Newest First', value: '!year' },
            { label: 'Oldest First', value: 'year' }
        ];
        // demo *-*-*-*-*-*-*-*-* END
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    // demo *-*-*-*-*-*-*-*-* START
    generateCar(): any {
        return {
            vin: this.generateVin(),
            brand: this.generateBrand(),
            color: this.generateColor(),
            year: this.generateYear()
        };
    }

    generateVin() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateBrand() {
        return this.brands[Math.floor(Math.random() * Math.floor(10))];
    }

    generateColor() {
        return this.colors[Math.floor(Math.random() * Math.floor(7))];
    }

    generateYear() {
        return 2000 + Math.floor(Math.random() * Math.floor(19));
    }

    loadCarsLazy(event: LazyLoadEvent) {
        console.log('---evnet', event);

        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page

        // imitate db connection over a network
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.lazyCars = [];
            if (this.cars) {
                this.lazyCars = this.cars.slice(event.first, event.first + event.rows);
            }
        }, 1000);
    }
    // demo *-*-*-*-*-*-*-*-* END

    /**
     * Redirects to create configuration page
     *
     * @memberof DotServiceIntegrationConfigurationListComponent
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
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    editConfiguration($event: MouseEvent, configurationId: string): void {
        $event.stopPropagation();
        this.dotRouterService.gotoPortlet(
            `/integration-services/${this.serviceIntegration.key}/edit/${configurationId}`
        );
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
                this.dotServiceIntegrationService
                    .deleteConfiguration(this.serviceIntegration.key, site.id)
                    .pipe(take(1))
                    .subscribe(() => this.getConfiguration());
            },
            reject: () => {},
            header: this.messagesKey['service.integration.confirmation.title'],
            message: `${this.messagesKey['service.integration.confirmation.delete.message']} <b>${site.name}</b> ?`,
            footerLabel: {
                accept: this.messagesKey['service.integration.confirmation.accept']
            }
        });
    }

    /**
     * Display confirmation dialog to delete all configurations
     *
     * @memberof DotServiceIntegrationConfigurationListComponent
     */
    deleteAllConfigurations(): void {
        this.dotAlertConfirmService.confirm({
            accept: () => {
                this.dotServiceIntegrationService
                    .deleteAllConfigurations(this.serviceIntegration.key)
                    .pipe(take(1))
                    .subscribe(() => this.getConfiguration());
            },
            reject: () => {},
            header: this.messagesKey['service.integration.confirmation.title'],
            message: this.messagesKey['service.integration.confirmation.delete.all.message'],
            footerLabel: {
                accept: this.messagesKey['service.integration.confirmation.accept']
            }
        });
    }

    private getConfiguration() {
        this.dotServiceIntegrationService
            .getConfiguration(this.serviceIntegration.key)
            .pipe(take(1))
            .subscribe(
                (configuration: DotServiceIntegration) => (this.serviceIntegration = configuration)
            );
    }
}
