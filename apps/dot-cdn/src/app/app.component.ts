import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartData, ChartOptions, DotCDNStats, SelectValue } from './app.interface';
import { DotCDNService } from './dotcdn.service';
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
    constructor(private readonly dotCdnService: DotCDNService) {}

    @ViewChild('chart', { static: true }) chart: any;
    content$: Observable<{ label: string; value: string }[]>;

    periodValues: SelectValue[] = [
        { name: 'Last 30 days', value: ChartPeriod.Last30Days },
        { name: 'Last 60 days', value: ChartPeriod.Last60Days }
    ];

    selectedPeriod: Pick<SelectValue, 'value'> = { value: ChartPeriod.Last30Days };

    chartData: ChartData | Record<string, unknown> = {};
    data: Partial<DotCDNStats> = {};
    
    options: ChartOptions | Record<string, unknown> = {};

    ngOnInit(): void {
        this.setData(this.selectedPeriod.value);
    }

    // TODO: Missing type
    changePeriod(event) {
        this.setData(event.value);
    }

    private setData(period: string): void {
        // TODO: type
        this.dotCdnService.requestStats(period).subscribe((data: any) => {
            this.data = data;

            this.chartData = {
                labels: this.getLabels(data.stats.bandwidthUsedChart),
                datasets: [
                    {
                        label: 'Bandwidth Used',
                        data: Object.values(data.stats.bandwidthUsedChart),
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
