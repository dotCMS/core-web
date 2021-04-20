import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, DotCDNStats, SelectValue, DotChartStats } from './app.interface';
import { DotCDNService } from './dotcdn.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

enum ChartPeriod {
    Last30Days = '30',
    Last60Days = '60'
}

@Component({
    selector: 'dotcms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public purgeZoneForm: FormGroup;
    @ViewChild('chart', { static: true }) chart: any;

    periodValues: SelectValue[] = [
        { name: 'Last 30 days', value: ChartPeriod.Last30Days },
        { name: 'Last 60 days', value: ChartPeriod.Last60Days }
    ];
    selectedPeriod: Pick<SelectValue, 'value'> = { value: ChartPeriod.Last30Days };
    chartData: ChartData | Record<string, unknown> = {};
    statsData: DotChartStats[] = [];
    isLoading = true;
    chartHeight = '25rem';
    urlsString = '';

    options: ChartOptions | Record<string, unknown> = {};

    constructor(private readonly dotCdnService: DotCDNService, private fb: FormBuilder) {
        this.purgeZoneForm = fb.group({
            textArea: ''
        });
    }

    ngOnInit(): void {
        this.setOptions();
        this.setData(this.selectedPeriod.value);
    }

    // TODO: Missing type
    changePeriod(event) {
        this.isLoading = true;
        this.setData(event.value);
        console.log(this.purgeZoneForm);
    }

    purgePullZone(event: Event) {
        this.dotCdnService.purgePullZone(event);
    }

    purgeUrls() {
       const urls = this.urlsString.split(',').map(url => url.trim());
       this.dotCdnService.purgeUrls(urls);
    }

    setUrlString(urls: string) {
        this.urlsString = urls;
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
        this.dotCdnService.requestStats(period).subscribe(({ stats }: DotCDNStats) => {
            this.isLoading = false;
            this.statsData = [
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

            this.chartData = {
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
        });
    }

    private getLabels(data: { [key: string]: number }): string[] {
        return Object.keys(data).map((label) => label.split('T')[0]);
    }
}
