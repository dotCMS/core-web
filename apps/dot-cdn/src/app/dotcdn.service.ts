import { Injectable } from '@angular/core';
import { merge, ReplaySubject } from 'rxjs';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { pluck, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DotCDNService {
    currentSite$: ReplaySubject<string> = new ReplaySubject(null);

    constructor(private coreWebService: CoreWebService, private siteService: SiteService) {
        this.siteService
            .getCurrentSite()
            .pipe(pluck('identifier'))
            .subscribe((hostId: string) => {
                this.currentSite$.next(hostId);
            });
    }
    /**
     * Request stats via Core Web Service
     *
     * @param {string} period
     * @return {*}  {*} // TODO: Find appropriate return type
     * @memberof DotCDNService
     */
    requestStats(period: string): any {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                const dateTo = moment().format('YYYY-MM-DD');
                const dateFrom = moment().subtract(period, 'd').format('YYYY-MM-DD');
                return this.coreWebService.request({
                    url: `/api/v1/dotcdn/stats?hostId=${hostId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                });
            })
        );
    }

    purgeCache(urls: string[] = [], invalidateAll: boolean = false) {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                return this.purgeUrlRequest(urls, hostId, invalidateAll);
            })
        );
    }

    private purgeUrlRequest(urls: string[], hostId: string, invalidateAll: boolean) {
        return this.coreWebService.request({
            url: `/api/v1/dotcdn`,
            method: 'DELETE',
            body: JSON.stringify({
                urls,
                invalidateAll,
                hostId
            })
        });
    }
}
