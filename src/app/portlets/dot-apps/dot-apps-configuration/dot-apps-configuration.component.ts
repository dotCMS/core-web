import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {
    DotApps,
    DotAppsExportConfiguration,
    DotAppsSites
} from '@shared/models/dot-apps/dot-apps.model';
import { ActivatedRoute } from '@angular/router';
import { pluck, take, debounceTime, takeUntil } from 'rxjs/operators';
import { DotAlertConfirmService } from '@services/dot-alert-confirm';
import { DotAppsService } from '@services/dot-apps/dot-apps.service';
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { DotRouterService } from '@services/dot-router/dot-router.service';

import { LazyLoadEvent } from 'primeng/api';
import { PaginatorService } from '@services/paginator';
import { DotMessageService } from '@services/dot-message/dot-messages.service';
import { DotDialogActions } from '@components/dot-dialog/dot-dialog.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'dot-apps-configuration',
    templateUrl: './dot-apps-configuration.component.html',
    styleUrls: ['./dot-apps-configuration.component.scss']
})
export class DotAppsConfigurationComponent implements OnInit, OnDestroy {
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
    apps: DotApps;

    hideLoadDataButton: boolean;
    paginationPerPage = 40;
    totalRecords: number;

    form: FormGroup;
    showExportDialog = false;
    dialogExportActions: DotDialogActions;
    exportErrorMessage: string;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotAlertConfirmService: DotAlertConfirmService,
        private dotAppsService: DotAppsService,
        private dotMessageService: DotMessageService,
        private dotRouterService: DotRouterService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public paginationService: PaginatorService
    ) {}

    ngOnInit() {
        this.route.data.pipe(pluck('data'), take(1)).subscribe((app: DotApps) => {
            this.apps = app;
            this.apps.sites = [];
        });

        observableFromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(debounceTime(500), takeUntil(this.destroy$))
            .subscribe((keyboardEvent: Event) => {
                this.filterConfigurations(keyboardEvent.target['value']);
            });

        this.paginationService.url = `v1/apps/${this.apps.key}`;
        this.paginationService.paginationPerPage = this.paginationPerPage;
        this.paginationService.sortField = 'name';
        this.paginationService.setExtraParams('filter', '');
        this.paginationService.sortOrder = 1;
        this.loadData();
        this.setExportDialog();

        this.searchInput.nativeElement.focus();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Set change events and initial configuration of form elements in Export dialog
     *
     * @memberof DotAppsConfigurationComponent
     */
    setExportDialog(): void {
        this.form = this.fb.group({
            password: new FormControl('', Validators.required)
        });

        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.dialogExportActions = {
                ...this.dialogExportActions,
                accept: {
                    ...this.dialogExportActions.accept,
                    disabled: !this.form.valid
                }
            };
        });
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
                this.hideLoadDataButton = !this.isThereMoreData(this.apps.sites.length);
            });
    }

    /**
     * Redirects to create/edit configuration site page
     *
     * @param DotAppsSites site
     * @memberof DotAppsConfigurationComponent
     */
    gotoConfiguration(site: DotAppsSites): void {
        this.dotRouterService.goToUpdateAppsConfiguration(this.apps.key, site);
    }

    /**
     * Redirects to app configuration listing page
     *
     * @param string key
     * @memberof DotAppsConfigurationComponent
     */
    goToApps(key: string): void {
        this.dotRouterService.gotoPortlet(`/apps/${key}`);
    }

    /**
     * Opens the dialog and set Export actions based on a single/all sites
     *
     * @param DotAppsSites [site]
     * @memberof DotAppsConfigurationComponent
     */
    confirmExport(site?: DotAppsSites): void {
        this.setExportDialogActions(site);
        this.showExportDialog = true;
    }

    /**
     * Close the dialog and clear the form
     *
     * @memberof DotAppsConfigurationComponent
     */
    closeExportDialog(): void {
        this.showExportDialog = false;
        this.exportErrorMessage = '';
        this.form.reset();
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
            header: this.dotMessageService.get('apps.confirmation.title'),
            message: this.dotMessageService.get('apps.confirmation.delete.all.message'),
            footerLabel: {
                accept: this.dotMessageService.get('apps.confirmation.accept')
            }
        });
    }

    private setExportDialogActions(site?: DotAppsSites): void {
        this.dialogExportActions = {
            accept: {
                action: () => {
                    const requestConfiguration: DotAppsExportConfiguration = {
                        password: this.form.value.password,
                        exportAll: false,
                        appKeysBySite: site
                            ? { [site.id]: [this.apps.key] }
                            : this.getAllKeySitesConfig()
                    };

                    this.dotAppsService
                        .exportConfiguration(requestConfiguration)
                        .then((errorMsg: string) => {
                            if (errorMsg) {
                                this.exportErrorMessage = this.dotMessageService.get(
                                    'apps.confirmation.export.error'
                                );
                            } else {
                                this.closeExportDialog();
                            }
                        });
                },
                label: this.dotMessageService.get('dot.common.dialog.accept'),
                disabled: true
            },
            cancel: {
                label: this.dotMessageService.get('dot.common.dialog.reject'),
                action: () => {
                    this.closeExportDialog();
                }
            }
        };
    }

    private getAllKeySitesConfig(): { [key: string]: string[] } {
        const keySitesConf = {};
        this.apps.sites.forEach((site: DotAppsSites) => {
            if (site.configured) {
                keySitesConf[site.id] = [this.apps.key];
            }
        });
        return keySitesConf;
    }

    private isThereMoreData(index: number): boolean {
        return this.totalRecords / index > 1;
    }

    private filterConfigurations(searchCriteria?: string): void {
        this.paginationService.setExtraParams('filter', searchCriteria);
        this.loadData();
    }
}
