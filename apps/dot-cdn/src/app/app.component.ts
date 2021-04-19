import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartData, ChartOptions, SelectValue, DotCDNStats } from './app.interface';
import { DotCDNService } from './dotcdn.service';

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
        { name: 'Last 30 days', value: '30' },
        { name: 'Last 60 days', value: '60' }
    ];
    selectedPeriod: Pick<SelectValue, 'value'> = { value: '30' };

    data: ChartData | Record<string, unknown> = {};
    options: ChartOptions | Record<string, unknown> = {};

    ngOnInit(): void {
        this.setOptions();
        this.setData();
    }

    changePeriod(e) {
        console.log(e);
    }

    private setOptions(): void {
        this.options = {
            title: {
                display: true,
                text: 'My Title',
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            }
        };
    }

    private setData(): void {
        this.dotCdnService.requestStats(this.selectedPeriod.value).subscribe((data) => {
            this.data = {
                labels: Object.keys(data.stats.bandwidthUsedChart),
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
}
