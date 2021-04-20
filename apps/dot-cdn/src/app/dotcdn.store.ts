import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { ChartData, DotChartStats } from './app.interface';

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
    constructor() {
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

    readonly addChartData = this.updater((state, chartData: ChartData) => {
        return {
            ...state,
            chartData
        };
    });

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
}
