import { Component, OnInit, ViewChild } from '@angular/core';
import { DotCDNState } from './app.interface';
import { ChartPeriod } from './app.enums';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DotCDNStore } from './dotcdn.store';
import { Observable } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ChartOptions } from 'chart.js';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dotcms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart: any;
    purgeZoneForm: FormGroup;
    periodValues: SelectItem[] = [
        { label: 'Last 30 days', value: ChartPeriod.Last30Days },
        { label: 'Last 60 days', value: ChartPeriod.Last60Days }
    ];

    selectedPeriod: SelectItem<string> = { value: ChartPeriod.Last30Days };
    vm$: Observable<Partial<DotCDNState>> = this.dotCdnStore.vm$;
    vmPurgeLoaders$: Observable<Partial<DotCDNState>> = this.dotCdnStore.vmPurgeLoaders$;
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
        const invalidateAll = true;
        this.dotCdnStore.purgeCDNCache(invalidateAll);
    }

    /**
     * Purges all the URLs in the array
     *
     * @memberof AppComponent
     */
    purgeUrls(): void {
        const urls = this.purgeZoneForm
            .get('purgeUrlsTextArea')
            .value.split('\n')
            .map((url) => url.trim());

        this.dotCdnStore
            .purgeCDNCache(false, urls)
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
}
