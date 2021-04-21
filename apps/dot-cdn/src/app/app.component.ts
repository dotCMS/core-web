import { Component, OnInit, ViewChild } from '@angular/core';
import { DotCDNStoreViewModel } from './app.interface';
import { DotCDNService } from './dotcdn.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DotCDNStore, Loader, LoadingState } from './dotcdn.store';
import { Observable } from 'rxjs';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { ChartOptions } from 'chart.js';

enum ChartPeriod {
    Last30Days = '30',
    Last60Days = '60'
}

export interface DotCDNState {
    chartData: [];
    isChartLoading: LoadingState;
    isPurgeUrlsLoading: LoadingState;
    isPurgeZoneLoading: LoadingState;
}
@Component({
    selector: 'dotcms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart: any;
    purgeZoneForm: FormGroup;
    periodValues: SelectItem[] = [
        { label: 'Last 30 days', value: ChartPeriod.Last30Days, title: 'asas' },
        { label: 'Last 60 days', value: ChartPeriod.Last60Days }
    ];

    selectedPeriod: Pick<SelectItemGroup, 'value'> = { value: ChartPeriod.Last30Days };
    vm$: Observable<DotCDNStoreViewModel> = this.dotCdnStore.vm$;
    chartHeight = '25rem';
    options: ChartOptions;

    constructor(
        private readonly dotCdnService: DotCDNService,
        private fb: FormBuilder,
        private dotCdnStore: DotCDNStore
    ) {}

    ngOnInit(): void {
        this.setChartOptions();
        this.dotCdnStore.getChartStats(this.selectedPeriod.value);
        this.purgeZoneForm = this.fb.group({
            purgeUrlsTextArea: ''
        });
    }

    /**
     *  Handles the period change
     *
     * @param {*} event
     * @memberof AppComponent
     */
    changePeriod(element: HTMLTextAreaElement): void {
        this.dotCdnStore.dispatchLoading({
            loadingState: LoadingState.LOADING,
            loader: Loader.CHART
        });
        this.dotCdnStore.getChartStats(element.value);
    }
    /**
     * Purges the entire cache
     *
     * @memberof AppComponent
     */
    purgePullZone(): void {
        this.dotCdnStore.dispatchLoading({
            loadingState: LoadingState.LOADING,
            loader: Loader.PURGE_PULL_ZONE
        });
        this.dotCdnService.purgeCache(true).subscribe(() => {
            this.dotCdnStore.dispatchLoading({
                loadingState: LoadingState.LOADED,
                loader: Loader.PURGE_PULL_ZONE
            });
        });
    }
    /**
     * Purges all the URLs in the array
     *
     * @memberof AppComponent
     */
    purgeUrls(): void {
        const urls = this.purgeZoneForm
            .get('purgeUrlsTextArea')
            .value.split('\n')
            .map((url) => url.trim());

        this.dotCdnStore.dispatchLoading({
            loadingState: LoadingState.LOADING,
            loader: Loader.PURGE_URLS
        });

        this.dotCdnService.purgeCache(urls).subscribe(() => {
            this.resetPurgeUrlsForm();
        });
    }

    private resetPurgeUrlsForm(): void {
        this.dotCdnStore.dispatchLoading({
            loadingState: LoadingState.LOADED,
            loader: Loader.PURGE_URLS
        });
        this.purgeZoneForm.setValue({ purgeUrlsTextArea: '' });
    }

    private setChartOptions(): void {
        this.options = {
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1'
                    },
                    {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        id: 'y-axis-2',
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }
                ]
            }
        };
    }
}
