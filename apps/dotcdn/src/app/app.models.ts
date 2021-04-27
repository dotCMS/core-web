export interface ChartDataSet {
    label: string;
    data: string[];
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
export interface DotCDNStats {
    stats: {
        bandwidthPretty: string;
        bandwidthUsedChart: { [key: string]: number };
        requestsServedChart: { [key: string]: number };
        cacheHitRate: number;
        dateFrom: string;
        dateTo: string;
        geographicDistribution: unknown;
        totalBandwidthUsed: number;
        totalRequestsServed: number;
    };
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
    urls?: string[];
}
export interface DotCDNState {
    chartData: ChartData;
    statsData: DotChartStats[];
    isChartLoading: boolean;
    isPurgeUrlsLoading: boolean;
    isPurgeZoneLoading: boolean;
}

export interface PurgeReturnData {
    entity: { [key: string]: string };
    errors: string[];
    messages: string[];
    permissions: string[];
    i18nMessagesMap: { [key: string]: string };
}

export const enum ChartPeriod {
    Last15Days = '15',
    Last30Days = '30',
    Last60Days = '60'
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
