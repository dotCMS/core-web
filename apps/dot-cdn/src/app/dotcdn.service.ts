import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { filter, pluck, mergeMap, catchError } from 'rxjs/operators';
import { DotCDNStats } from './app.interface';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DotCDNService {
    constructor(private coreWebService: CoreWebService, private siteService: SiteService) {}

    requestStats(period: string): Observable<DotCDNStats> {
        const dateTo = moment().format('YYYY-MM-DD');
        const dateFrom = moment().subtract(period, 'd').format('YYYY-MM-DD');

        return this.siteService.getCurrentSite().pipe(
            pluck('identifier'),
            filter((hostId: string) => hostId !== 'undefined'),
            mergeMap((hostId) =>
                this.coreWebService.request({
                    url: `/api/v1/dotcdn/stats?hostId=${hostId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                })
            ),
            catchError((error) => {
                return of(error);
            })
        );
    }
}
