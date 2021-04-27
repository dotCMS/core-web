import { Component, OnInit, ViewChild } from '@angular/core';
import { DotCDNState, ChartPeriod } from './app.models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DotCDNStore } from './dotcdn.component.store';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ChartOptions } from 'chart.js';
import { take } from 'rxjs/operators';
import { UIChart } from 'primeng/chart';

@Component({
    selector: 'dotcms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart: UIChart;
    purgeZoneForm: FormGroup;
    periodValues: SelectItem[] = [
        { label: 'Last 30 days', value: ChartPeriod.Last30Days },
        { label: 'Last 60 days', value: ChartPeriod.Last60Days }
    ];
    selectedPeriod: SelectItem<string> = { value: ChartPeriod.Last30Days };
    vm$: Observable<Pick<DotCDNState, 'chartData' | 'statsData' | 'isChartLoading'>> = this
        .dotCdnStore.vm$;
    vmPurgeLoaders$: Observable<
        Pick<DotCDNState, 'isPurgeUrlsLoading' | 'isPurgeZoneLoading'>
    > = this.dotCdnStore.vmPurgeLoaders$;
    chartHeight = '25rem';
    options: ChartOptions;

    constructor(private fb: FormBuilder, private dotCdnStore: DotCDNStore) {}

    ngOnInit(): void {
        this.setChartOptions();
        this.purgeZoneForm = this.fb.group({
            purgeUrlsTextArea: ''
        });
    }

    /**
     *  Handles the period change
     *
     * @param {*} event
     * @memberof AppComponent
     */
    changePeriod(element: HTMLTextAreaElement): void {
        this.dotCdnStore.getChartStats(element.value);
    }

    /**
     * Purges the entire cache
     *
     * @memberof AppComponent
     */
    purgePullZone(): void {
        this.dotCdnStore.purgeCDNCacheAll();
    }

    /**
     * Purges all the URLs in the array
     *
     * @memberof AppComponent
     */
    purgeUrls(): void {
        const urls: string[] = this.purgeZoneForm
            .get('purgeUrlsTextArea')
            .value.split('\n')
            .map((url) => url.trim());

        this.dotCdnStore
            .purgeCDNCache(urls)
            .pipe(take(1))
            .subscribe(() => {
                this.purgeZoneForm.setValue({ purgeUrlsTextArea: '' });
            });
    }

    private setChartOptions(): void {
        this.options = {
            responsive: true,
            hover: {
                mode: 'index'
            },
            tooltips: {
                callbacks: {
                    label: function(context, data): string {
                        return `${data.datasets[0].label}: ${context.value}MB`;
                    }
                }
            },
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                        ticks: {
                            callback: function (value: number): string {
                                return (value / 1e6).toString() + 'MB';
                            }
                        },
                    }
                ]
            }
        };
    }
}
