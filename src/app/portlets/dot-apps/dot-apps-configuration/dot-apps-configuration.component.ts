import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DotApps, DotAppsSites } from '@shared/models/dot-apps/dot-apps.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, take, debounceTime } from 'rxjs/operators';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotAppsService } from '@services/dot-apps/dot-apps.service';
import { fromEvent as observableFromEvent } from 'rxjs';
import { DotRouterService } from '@services/dot-router/dot-router.service';

import { LazyLoadEvent } from 'primeng/primeng';
import { PaginatorService } from '@services/paginator';
import { AppsResolverData } from './dot-apps-configuration-resolver.service';

@Component({
    selector: 'dot-apps-configuration',
    templateUrl: './dot-apps-configuration.component.html',
    styleUrls: ['./dot-apps-configuration.component.scss']
})
export class DotAppsConfigurationComponent implements OnInit {
    @ViewChild('searchInput')
    searchInput: ElementRef;
    messagesKey: { [key: string]: string } = {};
    apps: DotApps;

    disabledLoadDataButton: boolean;
    paginationPerPage = 10;
    totalRecords: number;
    showMore: boolean;

    constructor(
        private dotAlertConfirmService: DotAlertConfirmService,
        private dotAppsService: DotAppsService,
        private dotRouterService: DotRouterService,
        private route: ActivatedRoute,
        public paginationService: PaginatorService
    ) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('data'), take(1))
            .subscribe(({ messages, app }: AppsResolverData) => {
                this.apps = app;
                this.apps.sites = [];
                this.messagesKey = messages;
            });

        observableFromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500))
            .subscribe((keyboardEvent: Event) => {
                this.filterConfigurations(keyboardEvent.target['value']);
            });

        this.paginationService.url = `v1/apps/${this.apps.key}`;
        this.paginationService.paginationPerPage = this.paginationPerPage;
        this.paginationService.sortField = 'name';
        this.paginationService.setExtraParams('filter', '');
        this.paginationService.sortOrder = 1;
        this.loadData();

        this.searchInput.nativeElement.focus();
    }

    /**
     * Loads data through pagination service
     *
     * @param LazyLoadEvent event
     * @memberof DotAppsConfigurationComponent
     */
    loadData(event?: LazyLoadEvent): void {
        this.paginationService
            .getWithOffset((event && event.first) || 0)
            .pipe(take(1))
            .subscribe((apps: DotApps[]) => {
                const app = [].concat(apps)[0];
                this.apps.sites = event ? this.apps.sites.concat(app.sites) : app.sites;
                this.apps.configurationsCount = app.configurationsCount;
                this.totalRecords = this.paginationService.totalRecords;
                this.disabledLoadDataButton = !this.isThereMoreData(this.apps.sites.length);
            });
    }

    /**
     * Redirects to create/edit configuration site page
     *
     * @param DotAppsSites site
     * @memberof DotAppsConfigurationComponent
     */
    gotoConfiguration(site: DotAppsSites): void {
        this.dotRouterService.goToAppsServices(this.apps.key, site);
    }

    /**
     * Display confirmation dialog to delete a specific configuration
     *
     * @param DotAppsSites site
     * @memberof DotAppsConfigurationComponent
     */
    deleteConfiguration(site: DotAppsSites): void {
        this.dotAppsService
            .deleteConfiguration(this.apps.key, site.id)
            .pipe(take(1))
            .subscribe(() => {
                this.apps.sites = [];
                this.loadData();
            });
    }

    /**
     * Display confirmation dialog to delete all configurations
     *
     * @memberof DotAppsConfigurationComponent
     */
    deleteAllConfigurations(): void {
        this.dotAlertConfirmService.confirm({
            accept: () => {
                this.dotAppsService
                    .deleteAllConfigurations(this.apps.key)
                    .pipe(take(1))
                    .subscribe(() => {
                        this.apps.sites = [];
                        this.loadData();
                    });
            },
            reject: () => {},
            header: this.messagesKey['apps.confirmation.title'],
            message: this.messagesKey['apps.confirmation.delete.all.message'],
            footerLabel: {
                accept: this.messagesKey['apps.confirmation.accept']
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
