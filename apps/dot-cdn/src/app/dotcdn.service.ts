import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { filter, pluck, mergeMap, catchError } from 'rxjs/operators';
import { DotCDNStats } from './app.interface';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DotCDNService {
    currentSite: ReplaySubject<string> = new ReplaySubject(null);

    constructor(private coreWebService: CoreWebService, private siteService: SiteService) {
        this.siteService
            .getCurrentSite()
            .pipe(pluck('identifier'))
            .subscribe((hostId: string) => {
                this.currentSite.next(hostId);
            });
    }

    // TODO: Find appropriate type
    requestStats(period: string): any {
        return this.currentSite.pipe(
            mergeMap((hostId: string) => {
                const dateTo = moment().format('YYYY-MM-DD');
                const dateFrom = moment().subtract(period, 'd').format('YYYY-MM-DD');
                return this.coreWebService.request({
                    url: `/api/v1/dotcdn/stats?hostId=${hostId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                });
            })
        );
    }
}
