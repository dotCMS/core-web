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
    stats: {
        bandwidthPretty: string;
        bandwidthUsedChart: { [key: string]: number };
        cacheHitRate: number;
        dateFrom: DotCDNDate;
        dateTo: DotCDNDate;
        geographicDistribution: unknown;
        id: number;
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
