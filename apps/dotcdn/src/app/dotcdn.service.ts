import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { CoreWebService, ResponseView, SiteService } from '@dotcms/dotcms-js';
import { pluck, mergeMap, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DotCDNStats, PurgeUrlOptions } from './app.models';

const fakeResponseData: DotCDNStats = {
    stats: {
        bandwidthPretty: '114.42 MB',
        bandwidthUsedChart: {
            '2021-03-24T00:00:00Z': 0,
            '2021-03-25T00:00:00Z': 0,
            '2021-03-26T00:00:00Z': 0,
            '2021-03-27T00:00:00Z': 0,
            '2021-03-28T00:00:00Z': 0,
            '2021-03-29T00:00:00Z': 0,
            '2021-03-30T00:00:00Z': 0,
            '2021-03-31T00:00:00Z': 0,
            '2021-04-01T00:00:00Z': 0,
            '2021-04-02T00:00:00Z': 0,
            '2021-04-03T00:00:00Z': 0,
            '2021-04-04T00:00:00Z': 0,
            '2021-04-05T00:00:00Z': 0,
            '2021-04-06T00:00:00Z': 0,
            '2021-04-07T00:00:00Z': 0,
            '2021-04-08T00:00:00Z': 0,
            '2021-04-09T00:00:00Z': 0,
            '2021-04-10T00:00:00Z': 0,
            '2021-04-11T00:00:00Z': 0,
            '2021-04-12T00:00:00Z': 0,
            '2021-04-13T00:00:00Z': 0,
            '2021-04-14T00:00:00Z': 0,
            '2021-04-15T00:00:00Z': 78554075,
            '2021-04-16T00:00:00Z': 15506849,
            '2021-04-17T00:00:00Z': 0,
            '2021-04-18T00:00:00Z': 0,
            '2021-04-19T00:00:00Z': 15301470,
            '2021-04-20T00:00:00Z': 5061682,
            '2021-04-21T00:00:00Z': 0,
            '2021-04-22T00:00:00Z': 0,
            '2021-04-23T00:00:00Z': 0
        },
        requestsServedChart: {
            '2021-03-24T00:00:00Z': 0,
            '2021-03-25T00:00:00Z': 0,
            '2021-03-26T00:00:00Z': 0,
            '2021-03-27T00:00:00Z': 0,
            '2021-03-28T00:00:00Z': 0,
            '2021-03-29T00:00:00Z': 0,
            '2021-03-30T00:00:00Z': 0,
            '2021-03-31T00:00:00Z': 0,
            '2021-04-01T00:00:00Z': 0,
            '2021-04-02T00:00:00Z': 0,
            '2021-04-03T00:00:00Z': 0,
            '2021-04-04T00:00:00Z': 0,
            '2021-04-05T00:00:00Z': 0,
            '2021-04-06T00:00:00Z': 0,
            '2021-04-07T00:00:00Z': 0,
            '2021-04-08T00:00:00Z': 0,
            '2021-04-09T00:00:00Z': 0,
            '2021-04-10T00:00:00Z': 0,
            '2021-04-11T00:00:00Z': 0,
            '2021-04-12T00:00:00Z': 0,
            '2021-04-13T00:00:00Z': 0,
            '2021-04-14T00:00:00Z': 0,
            '2021-04-15T00:00:00Z': 78554075,
            '2021-04-16T00:00:00Z': 15506849,
            '2021-04-17T00:00:00Z': 0,
            '2021-04-18T00:00:00Z': 0,
            '2021-04-19T00:00:00Z': 15301470,
            '2021-04-20T00:00:00Z': 5061682,
            '2021-04-21T00:00:00Z': 0,
            '2021-04-22T00:00:00Z': 0,
            '2021-04-23T00:00:00Z': 0
        },
        cacheHitRate: 14.615384615384617,
        dateFrom: '2021-03-23T23:00:00Z',
        dateTo: '2021-04-22T22:00:00Z',
        geographicDistribution: {
            NA: {
                ' Miami, FL': 114424076
            }
        },
        totalBandwidthUsed: 114424076,
        totalRequestsServed: 130
    }
};
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
     * @return {*}
     * @memberof DotCDNService
     */
    purgeCache(urls?: string[]): Observable<ResponseView<any>> {
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
     * @return {*}
     * @memberof DotCDNService
     */
    purgeCacheAll(): Observable<ResponseView<any>> {
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
    }: PurgeUrlOptions): Observable<ResponseView<any>> {
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
