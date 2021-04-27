import { Injectable } from '@angular/core';
import { ResponseView } from '@dotcms/dotcms-js';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMapTo, tap, pluck } from 'rxjs/operators';
import {
    ChartData,
    DotCDNState,
    DotCDNStats,
    DotChartStats,
    ChartPeriod,
    Loader,
    LoadingState,
    PurgeReturnData
} from './app.models';
import { DotCDNService } from './dotcdn.service';

@Injectable()
export class DotCDNStore extends ComponentStore<DotCDNState> {
    selectedPeriod: SelectItem<string> = { value: ChartPeriod.Last15Days };

    constructor(private readonly dotCdnService: DotCDNService) {
        super({
            chartBandwidthData: {
                labels: [],
                datasets: []
            },
            chartRequestsData: {
                labels: [],
                datasets: []
            },
            cdnDomain: '',
            statsData: [],
            isChartLoading: false,
            isPurgeUrlsLoading: false,
            isPurgeZoneLoading: false
        });
        this.getChartStats(this.selectedPeriod.value);
    }

    readonly vm$ = this.select(
        ({ isChartLoading, chartBandwidthData, chartRequestsData, statsData, cdnDomain }) => ({
            chartBandwidthData,
            chartRequestsData,
            statsData,
            isChartLoading,
            cdnDomain
        })
    );

    readonly vmPurgeLoaders$ = this.select(({ isPurgeUrlsLoading, isPurgeZoneLoading }) => ({
        isPurgeUrlsLoading,
        isPurgeZoneLoading
    }));

    /**
     *
     *  Adds chart data
     * @memberof DotCDNStore
     */
    readonly addChartBandwidthData = this.updater((state, chartData: ChartData) => {
        return {
            ...state,
            chartBandwidthData: chartData
        };
    });

    readonly addChartRequestData = this.updater((state, chartData: ChartData) => {
        return {
            ...state,
            chartRequestsData: chartData
        };
    });

    /**
     *
     *  Adds stats data
     * @memberof DotCDNStore
     */
    readonly addStatsData = this.updater((state, statsData: DotChartStats[]) => {
        return {
            ...state,
            statsData
        };
    });
    /**
     *
     *  Adds stats data
     * @memberof DotCDNStore
     */
    readonly addCdnDomain = this.updater((state, cdnDomain: string) => {
        return {
            ...state,
            cdnDomain
        };
    });

    /**
     *  Handles the chart data fetching
     *
     * @memberof DotCDNStore
     */
    readonly getChartStats = this.effect(
        (period$: Observable<string>): Observable<DotCDNStats> => {
            return period$.pipe(
                mergeMap((period: string) => {
                    // Dispatch the loading state
                    this.dispatchLoading({
                        loadingState: LoadingState.LOADING,
                        loader: Loader.CHART
                    });
                    return this.dotCdnService.requestStats(period).pipe(
                        tapResponse(
                            (data: DotCDNStats) => {
                                // Now the chart is loaded
                                this.dispatchLoading({
                                    loadingState: LoadingState.LOADED,
                                    loader: Loader.CHART
                                });

                                const {
                                    statsData,
                                    chartData: [bandwidthData, requestsData],
                                    cdnDomain
                                } = this.getChartStatsData(data);

                                this.addChartBandwidthData(bandwidthData);
                                this.addChartRequestData(requestsData);
                                this.addStatsData(statsData);
                                this.addCdnDomain(cdnDomain);
                            },
                            (error) => {
                                // TODO: Handle error
                                console.log(error);
                            }
                        )
                    );
                })
            );
        }
    );

    /**
     *  Dispatches a loading state
     *
     * @memberof DotCDNStore
     */
    readonly dispatchLoading = this.updater(
        (state, action: { loadingState: string; loader: string }) => {
            switch (action.loader) {
                case Loader.CHART:
                    return {
                        ...state,
                        isChartLoading: action.loadingState === LoadingState.LOADING
                    };
                case Loader.PURGE_URLS:
                    return {
                        ...state,
                        isPurgeUrlsLoading: action.loadingState === LoadingState.LOADING
                    };
                case Loader.PURGE_PULL_ZONE:
                    return {
                        ...state,
                        isPurgeZoneLoading: action.loadingState === LoadingState.LOADING
                    };
            }
        }
    );

    /**
     * Purges the CDN cache
     *
     * @param {boolean} [invalidateAll=false]
     * @param {string[]} [urls]
     * @return {*}  {(Observable<ResponseView<any>> | void)}
     * @memberof DotCDNStore
     */

    purgeCDNCache(urls: string[]): Observable<ResponseView<PurgeReturnData>> {
        const loading$ = of(
            this.dispatchLoading({
                loadingState: LoadingState.LOADING,
                loader: Loader.PURGE_URLS
            })
        );
        return loading$.pipe(
            switchMapTo(
                this.dotCdnService.purgeCache(urls).pipe(
                    tap(() => {
                        this.dispatchLoading({
                            loadingState: LoadingState.LOADED,
                            loader: Loader.PURGE_URLS
                        });
                    })
                )
            ),
            pluck('bodyJsonObject')
        );
    }

    purgeCDNCacheAll(): void {
        const $loading = of(
            this.dispatchLoading({
                loadingState: LoadingState.LOADING,
                loader: Loader.PURGE_PULL_ZONE
            })
        );

        $loading
            .pipe(switchMapTo(this.dotCdnService.purgeCacheAll()), pluck('bodyJsonObject'))
            .subscribe(() => {
                this.dispatchLoading({
                    loadingState: LoadingState.LOADED,
                    loader: Loader.PURGE_PULL_ZONE
                });
            });
    }

    private getChartStatsData({ stats }: DotCDNStats) {
        const chartData: ChartData[] = [
            {
                labels: this.getLabels(stats.bandwidthUsedChart),
                datasets: [
                    {
                        label: 'Bandwidth Used',
                        data: Object.values(stats.bandwidthUsedChart).map((values) =>
                            (values / 1e6).toFixed(2).toString()
                        ),
                        borderColor: '#6f5fa3',
                        fill: false
                    }
                ]
            },
            {
                labels: this.getLabels(stats.requestsServedChart),
                datasets: [
                    {
                        label: 'Requests Served',
                        data: Object.values(
                            stats.requestsServedChart
                        ).map((value: number): string => value.toString()),
                        borderColor: '#FFA726',
                        fill: false
                    }
                ]
            }
        ];

        const statsData: DotChartStats[] = [
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

        return { chartData, statsData, cdnDomain: stats.cdnDomain };
    }

    /**
     *
     * This private method is responsible for transforming the keys from bandwidthUsedChart in order to make it more readable
     * It takes the timestamp and removes the time from the string
     */
    private getLabels(data: { [key: string]: number }): string[] {
        return Object.keys(data).map((label) => label.split('T')[0]);
    }
}
