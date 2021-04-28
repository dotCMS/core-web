import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CoreWebService, ResponseView, SiteService } from '@dotcms/dotcms-js';
import { pluck, mergeMap, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DotCDNStats, PurgeReturnData, PurgeUrlOptions } from './app.models';
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
    requestStats(period: string): Observable<DotCDNStats> {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                const dateTo = moment().format('YYYY-MM-DD');
                const dateFrom = moment().subtract(period, 'd').format('YYYY-MM-DD');
                return this.coreWebService.requestView({
                    url: `/api/v1/dotcdn/stats?hostId=${hostId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
                });
            }),
            map((value) => value.entity)
        );
    }

    /**
     *  Makes a request to purge the cache
     *
     * @param {string[]} [urls=[]]
     * @param {boolean} [invalidateAll=false]
     * @return {Observable<ResponseView<PurgeReturnData>>}
     * @memberof DotCDNService
     */
    purgeCache(urls?: string[]): Observable<ResponseView<PurgeReturnData>> {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                return this.purgeUrlRequest({ hostId, invalidateAll: false, urls });
            })
        );
    }

    /**
     *  Makes a request to purge the cache
     *
     * @param {string[]} [urls=[]]
     * @param {boolean} [invalidateAll=false]
     * @return {Observable<ResponseView<PurgeReturnData>>}
     * @memberof DotCDNService
     */
    purgeCacheAll(): Observable<ResponseView<PurgeReturnData>> {
        return this.currentSite$.pipe(
            mergeMap((hostId: string) => {
                return this.purgeUrlRequest({ hostId, invalidateAll: true });
            })
        );
    }

    private purgeUrlRequest({
        urls = [],
        invalidateAll,
        hostId
    }: PurgeUrlOptions): Observable<ResponseView<PurgeReturnData>> {
        return this.coreWebService.requestView({
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
