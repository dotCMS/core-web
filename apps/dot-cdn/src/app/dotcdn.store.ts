import { Injectable } from '@angular/core';
import { ResponseView } from '@dotcms/dotcms-js';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ChartData, DotCDNStats, DotChartStats } from './app.interface';
import { DotCDNService } from './dotcdn.service';

export interface DotCDNState {
    chartData: ChartData;
    statsData: DotChartStats[];
    isChartLoading: string;
    isPurgeUrlsLoading: string;
    isPurgeZoneLoading: string;
}

export const enum LoadingState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    LOADED = 'LOADED'
}

export const enum Loader {
    CHART = 'CHART',
    PURGE_URLS = 'PURGE_URLS',
    PURGE_PULL_ZONE = 'PURGE_PULL_ZONE'
}

@Injectable()
export class DotCDNStore extends ComponentStore<DotCDNState> {
    constructor(private readonly dotCdnService: DotCDNService) {
        super({
            chartData: {
                labels: [],
                datasets: []
            },
            statsData: [],
            isChartLoading: LoadingState.IDLE,
            isPurgeUrlsLoading: LoadingState.IDLE,
            isPurgeZoneLoading: LoadingState.IDLE
        });
    }

    readonly chartData$: Observable<ChartData> = this.select((state) => state.chartData);
    readonly statsData$: Observable<DotChartStats[]> = this.select((state) => state.statsData);
    readonly isChartLoading$: Observable<boolean> = this.select(
        (state) => state.isChartLoading === LoadingState.LOADING
    );

    readonly isPurgeUrlsLoading$: Observable<boolean> = this.select(
        (state) => state.isPurgeUrlsLoading === LoadingState.LOADING
    );

    readonly isPurgeZoneLoading$: Observable<boolean> = this.select(
        (state) => state.isPurgeZoneLoading === LoadingState.LOADING
    );

    readonly vm$ = this.select(
        ({ chartData, statsData, isChartLoading, isPurgeUrlsLoading, isPurgeZoneLoading }) => ({
            chartData,
            statsData,
            isChartLoading: isChartLoading === LoadingState.LOADING,
            isPurgeUrlsLoading: isPurgeUrlsLoading === LoadingState.LOADING,
            isPurgeZoneLoading: isPurgeZoneLoading === LoadingState.LOADING
        })
    );

    /**
     *
     *  Adds chart data
     * @memberof DotCDNStore
     */
    readonly addChartData = this.updater((state, chartData: ChartData) => {
        return {
            ...state,
            chartData
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
     *  Dispatches a loading state
     *
     * @memberof DotCDNStore
     */
    readonly dispatchLoading = this.updater(
        (state, action: { loadingState: string; loader: string }) => {
            console.log(action.loader, action.loadingState);
            switch (action.loader) {
                case Loader.CHART:
                    return {
                        ...state,
                        isChartLoading: action.loadingState
                    };
                case Loader.PURGE_URLS:
                    return {
                        ...state,
                        isPurgeUrlsLoading: action.loadingState
                    };
                case Loader.PURGE_PULL_ZONE:
                    return {
                        ...state,
                        isPurgeZoneLoading: action.loadingState
                    };
            }
        }
    );

    /**
     *  Handles the chart data fetching
     *
     * @memberof DotCDNStore
     */
    readonly getChartStats = this.effect((period$: Observable<string>) => {
        return period$.pipe(
            mergeMap((period) => {
                // Dispatch the loading state
                this.dispatchLoading({
                    loadingState: LoadingState.LOADING,
                    loader: Loader.CHART
                });
                return this.dotCdnService.requestStats(period).pipe(
                    tap({
                        next: (data: ResponseView<DotCDNStats>) => {
                            this.dispatchLoading({
                                loadingState: LoadingState.LOADED,
                                loader: Loader.CHART
                            });
                            const stats: DotCDNStats = data.pick('stats');

                            const chartData: ChartData = {
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

                            this.addChartData(chartData);
                            this.addStatsData(statsData);
                        },
                        error: (e) => {
                            // TODO: Handle error
                            console.log(e);
                        }
                    }),
                    catchError(() => EMPTY)
                );
            })
        );
    });

    private getLabels(data: { [key: string]: number }): string[] {
        return Object.keys(data).map((label) => label.split('T')[0]);
    }
}
