import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreWebService } from '@dotcms/dotcms-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dotcms-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('chart', { static: true }) chart: any;
    content$: Observable<{ label: string; value: string }[]>;

    values = [
        { name: 'Last 30 days', value: 'last_30' },
        { name: 'Last 60 days', value: 'last_60' }
    ];

    data = {};

    options = {
        title: {
            display: true,
            text: 'My Title',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        }
    };

    constructor(private coreWebService: CoreWebService) {
        this.content$ = this.coreWebService
            .requestView({
                url: '/api/v1/contenttype/basetypes'
            })
            .pipe(map((res) => res.entity));
    }

    ngOnInit(): void {
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#42A5F5',
                    fill: false
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: '#FFA726',
                    fill: false
                }
            ]
        };
    }
}
