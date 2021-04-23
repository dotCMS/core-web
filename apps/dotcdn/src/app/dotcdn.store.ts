import { Injectable } from '@angular/core';
import { ResponseView } from '@dotcms/dotcms-js';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';
import { ChartData, DotCDNState, DotCDNStats, DotChartStats } from './app.interface';
import { ChartPeriod, Loader, LoadingState } from './app.enums';
import { DotCDNService } from './dotcdn.service';

@Injectable()
export class DotCDNStore extends ComponentStore<DotCDNState> {
    selectedPeriod: SelectItem<string> = { value: ChartPeriod.Last30Days };

    constructor(private readonly dotCdnService: DotCDNService) {
        super({
            chartData: {
                labels: [],
                datasets: []
            },
            statsData: [],
            isChartLoading: true,
            isPurgeUrlsLoading: false,
            isPurgeZoneLoading: false
        });
        this.getChartStats(this.selectedPeriod.value);
    }

    readonly vm$ = this.select(({ isChartLoading, chartData, statsData }) => ({
        chartData,
        statsData,
        isChartLoading
    }));

    readonly vmPurgeLoaders$ = this.select(({ isPurgeUrlsLoading, isPurgeZoneLoading }) => ({
        isPurgeUrlsLoading,
        isPurgeZoneLoading
    }));

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
     *  Handles the chart data fetching
     *
     * @memberof DotCDNStore
     */
    readonly getChartStats = this.effect((period$: Observable<string>) => {
        return period$.pipe(
            mergeMap((period: string) => {
                // Dispatch the loading state
                this.dispatchLoading({
                    loadingState: LoadingState.LOADING,
                    loader: Loader.CHART
                });
                return this.dotCdnService.requestStats(period).pipe(
                    tapResponse(
                        (data: ResponseView<DotCDNStats>) => {
                            // Now the chart is loaded
                            this.dispatchLoading({
                                loadingState: LoadingState.LOADED,
                                loader: Loader.CHART
                            });

                            const { statsData, chartData } = this.setChartStatsData(data.entity);

                            this.addChartData(chartData);
                            this.addStatsData(statsData);
                        },
                        (error) => {
                            // TODO: Handle error
                            console.log(error);
                        }
                    )
                );
            })
        );
    });

    private setChartStatsData({ stats }: DotCDNStats) {
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

        return { chartData, statsData };
    }

    /**
     * Purges the CDN cache
     *
     * @param {boolean} [invalidateAll=false]
     * @param {string[]} [urls]
     * @return {*}  {(Observable<ResponseView<any>> | void)}
     * @memberof DotCDNStore
     */
    purgeCDNCache(invalidateAll: boolean): void;
    purgeCDNCache(invalidateAll: boolean, urls?: string[]): Observable<ResponseView<any>>;
    purgeCDNCache(
        invalidateAll: boolean = false,
        urls?: string[]
    ): Observable<ResponseView<any>> | void {
        if (!invalidateAll) {
            this.dispatchLoading({
                loadingState: LoadingState.LOADING,
                loader: Loader.PURGE_URLS
            });
            return this.dotCdnService.purgeCache(invalidateAll, urls).pipe(
                tap(() => {
                    this.dispatchLoading({
                        loadingState: LoadingState.LOADED,
                        loader: Loader.PURGE_URLS
                    });
                })
            );
        }

        this.dispatchLoading({
            loadingState: LoadingState.LOADING,
            loader: Loader.PURGE_PULL_ZONE
        });
        this.dotCdnService
            .purgeCache(invalidateAll)
            .pipe(take(1))
            .subscribe(() => {
                this.dispatchLoading({
                    loadingState: LoadingState.LOADED,
                    loader: Loader.PURGE_PULL_ZONE
                });
            });
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
