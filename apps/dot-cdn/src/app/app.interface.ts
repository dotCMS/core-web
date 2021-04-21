import { Loader, LoadingState } from './app.enums';

export interface ChartDataSet {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
}
export interface ChartOptions {
    title: {
        display: boolean;
        text: string;
        fontSize: number;
    };
    legend: {
        position: string;
    };
}

type DotCDNDate = { epochSecond: number; nano: number };
export interface DotCDNStats {
    bandwidthPretty: string;
    bandwidthUsedChart: { [key: string]: number };
    cacheHitRate: number;
    dateFrom: DotCDNDate;
    dateTo: DotCDNDate;
    geographicDistribution: unknown;
    id: number;
    totalBandwidthUsed: number;
    totalRequestsServed: number;
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataSet[];
}
export interface DotChartStats {
    label: string;
    value: string;
    icon: string;
}

export interface PurgeUrlOptions {
    hostId: string;
    invalidateAll: boolean;
    urls: string[];
}
export interface DotCDNState {
    chartData: ChartData;
    statsData: DotChartStats[];
    isChartLoading: boolean;
    isPurgeUrlsLoading: boolean;
    isPurgeZoneLoading: boolean;
}
