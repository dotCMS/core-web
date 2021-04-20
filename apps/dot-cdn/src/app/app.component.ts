import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, DotCDNStats, SelectValue, DotChartStats } from './app.interface';
import { DotCDNService } from './dotcdn.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DotCDNStore, Loader, LoadingState } from './dotcdn.store';
import { Observable } from 'rxjs';

enum ChartPeriod {
    Last30Days = '30',
    Last60Days = '60'
}

export interface DotCDNState {
    chartData: [];
    isChartLoading: string;
    isPurgeLoading: string;
    isPurgeZoneLoading: string;
}
@Component({
    selector: 'dotcms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart: any;
    purgeZoneForm: FormGroup;
    periodValues: SelectValue[] = [
        { name: 'Last 30 days', value: ChartPeriod.Last30Days },
        { name: 'Last 60 days', value: ChartPeriod.Last60Days }
    ];

    selectedPeriod: Pick<SelectValue, 'value'> = { value: ChartPeriod.Last30Days };
    chartData$: Observable<ChartData | Record<string, unknown>> = this.dotCdnStore.chartData$;
    statsData$: Observable<DotChartStats[]> = this.dotCdnStore.statsData$;
    isChartLoading$: Observable<boolean> = this.dotCdnStore.isChartLoading$;
    isPurgeUrlsLoading$: Observable<boolean> = this.dotCdnStore.isPurgeUrlsLoading$;
    isPurgeZoneLoading$: Observable<boolean> = this.dotCdnStore.isPurgeZoneLoading$;

    chartHeight = '25rem';
    urlsString = '';
    options: ChartOptions | Record<string, unknown> = {};

    constructor(
        private readonly dotCdnService: DotCDNService,
        private fb: FormBuilder,
        private dotCdnStore: DotCDNStore
    ) {
        this.purgeZoneForm = this.fb.group({
            purgeUrlsTextArea: ''
        });
    }

    ngOnInit(): void {
        this.setOptions();
        this.setData(this.selectedPeriod.value);
    }

    // TODO: Missing type
    changePeriod(event): void {
        this.dotCdnStore.dispatchLoading({
            loadingState: LoadingState.LOADING,
            loader: Loader.CHART
        });
        this.setData(event.value);
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
        const urls = this.urlsString.split(',').map((url) => url.trim());
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
            hoverMode: 'index',
            stacked: false,
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
                    value: stats.totalRequestsServed,
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
