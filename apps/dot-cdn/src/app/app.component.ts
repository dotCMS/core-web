import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, DotCDNStats, DotChartStats } from './app.interface';
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
    isPurgeLoading: LoadingState;
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
    chartData$: Observable<ChartData> = this.dotCdnStore.chartData$;
    statsData$: Observable<DotChartStats[]> = this.dotCdnStore.statsData$;
    isChartLoading$: Observable<boolean> = this.dotCdnStore.isChartLoading$;
    isPurgeUrlsLoading$: Observable<boolean> = this.dotCdnStore.isPurgeUrlsLoading$;
    isPurgeZoneLoading$: Observable<boolean> = this.dotCdnStore.isPurgeZoneLoading$;

    chartHeight = '25rem';
    urlsString = '';
    options: ChartOptions;

    constructor(
        private readonly dotCdnService: DotCDNService,
        private fb: FormBuilder,
        private dotCdnStore: DotCDNStore
    ) {}

    ngOnInit(): void {
        this.setOptions();
        this.setData(this.selectedPeriod.value);
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
        this.setData(element.value);
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
        this.dotCdnService.purgeCache([], true).subscribe(() => {
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
        this.urlsString = '';
        this.purgeZoneForm.setValue({ purgeUrlsTextArea: '' });
    }

    private setOptions(): void {
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

    private setData(period: string): void {
        this.dotCdnStore.dispatchLoading({
            loadingState: LoadingState.LOADING,
            loader: Loader.CHART
        });
        this.dotCdnService.requestStats(period).subscribe(({ stats }: DotCDNStats) => {
            this.dotCdnStore.dispatchLoading({
                loadingState: LoadingState.LOADED,
                loader: Loader.CHART
            });

            const chartData = {
                labels: this.getLabels(stats.bandwidthUsedChart),
                datasets: [
                    {
                        label: 'Bandwidth Used',
                        data: Object.values(stats.bandwidthUsedChart),
                        borderColor: '#42A5F5',
                        fill: false
                    }
                ]
            };

            const statsData = [
                {
                    label: 'Bandwidth Used',
                    value: stats.bandwidthPretty,
                    icon: 'insert_chart_outlined'
                },
                {
                    label: 'Requests Served',
                    value: `${stats.totalRequestsServed}`,
                    icon: 'file_download'
                },
                {
                    label: 'Cache Hit Rate',
                    value: `${stats.cacheHitRate.toFixed(2)}%`,
                    icon: 'file_download'
                }
            ];

            this.dotCdnStore.addChartData(chartData);
            this.dotCdnStore.addStatsData(statsData);
        });
    }

    private getLabels(data: { [key: string]: number }): string[] {
        return Object.keys(data).map((label) => label.split('T')[0]);
    }
}
