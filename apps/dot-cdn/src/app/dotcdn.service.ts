import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { CoreWebService, ResponseView, SiteService } from '@dotcms/dotcms-js';
import { pluck, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';
import { DotCDNStats, PurgeUrlOptions } from './app.interface';
@Injectable({
    providedIn: 'root'
})
export class DotCDNService {
    currentSite$: ReplaySubject<string> = new ReplaySubject();

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
     * @return {*}  {*}
     * @memberof DotCDNService
     */
    requestStats(period: string): Observable<ResponseView<DotCDNStats>> {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                const dateTo = moment().format('YYYY-MM-DD');
                const dateFrom = moment().subtract(period, 'd').format('YYYY-MM-DD');
                return this.coreWebService.requestView({
                    url: `/api/v1/dotcdn/stats?hostId=${hostId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                });
            })
        );
    }

    /**
     *  Makes a request to purge the cache
     *
     * @param {string[]} [urls=[]]
     * @param {boolean} [invalidateAll=false]
     * @return {*}
     * @memberof DotCDNService
     */
    purgeCache(invalidateAll = false, urls?: string[]): Observable<ResponseView<any>> {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                return this.purgeUrlRequest({ hostId, invalidateAll, urls });
            })
        );
    }

    private purgeUrlRequest({
        urls,
        invalidateAll,
        hostId
    }: PurgeUrlOptions): Observable<ResponseView<any>> {
        return this.coreWebService.requestView({
            url: `/api/v1/dotcdn`,
            method: 'DELETE',
            body: JSON.stringify({
                urls: urls || [],
                invalidateAll,
                hostId
            })
        });
    }
}
