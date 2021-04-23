import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { of } from 'rxjs';
import { Loader, LoadingState } from './app.enums';
import { DotCDNStats } from './app.interface';
import { CoreWebServiceMock } from './coreweb.service.mock';
import { DotCDNStore } from './dotcdn.component.store';
import { DotCDNService } from './dotcdn.service';
import { SiteServiceMock } from './siteservice.mock-temp';
import { mocked } from 'ts-jest/utils';

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

const fakeAddChartData = {
    labels: [
        '2021-04-15',
        '2021-04-16',
        '2021-04-17',
        '2021-04-18',
        '2021-04-19',
        '2021-04-20',
        '2021-04-21',
        '2021-04-22',
        '2021-04-23'
    ],
    datasets: [
        {
            label: 'Bandwidth Used',
            data: [78554075, 15506849, 0, 0, 15301470, 5061682, 0, 0, 0],
            borderColor: '#42A5F5',
            fill: false
        }
    ]
};

const fakeStatsData = [
    { label: 'Bandwidth Used', value: '114.42 MB', icon: 'insert_chart_outlined' },
    { label: 'Requests Served', value: '130', icon: 'file_download' },
    { label: 'Cache Hit Rate', value: '14.62%', icon: 'file_download' }
];

fdescribe('DotCDNComponentStore', () => {
    let store: DotCDNStore;
    let dotCdnService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DotCDNService,
                DotCDNStore,
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                { provide: SiteService, useClass: SiteServiceMock }
            ]
        });
        store = TestBed.inject(DotCDNStore);
        dotCdnService = TestBed.inject(DotCDNService);
    });

    fdescribe('DotCDN Component Store', () => {
        fit('should return chart state', (done) => {
            const addChartDataSpy = jest.spyOn(store, 'addChartData');
            store.addChartData(fakeAddChartData);
            store.state$.subscribe((state) => {
                expect(state.chartData.labels.length).toBe(9);
                expect(state.chartData.datasets.length).toBe(1);
                done();
            });

            expect(addChartDataSpy).toHaveBeenCalledWith({
                labels: [
                    '2021-04-15',
                    '2021-04-16',
                    '2021-04-17',
                    '2021-04-18',
                    '2021-04-19',
                    '2021-04-20',
                    '2021-04-21',
                    '2021-04-22',
                    '2021-04-23'
                ],
                datasets: [
                    {
                        label: 'Bandwidth Used',
                        data: [78554075, 15506849, 0, 0, 15301470, 5061682, 0, 0, 0],
                        borderColor: '#42A5F5',
                        fill: false
                    }
                ]
            });
        });

        fit('should return stats state', (done) => {
            const addStatsDataSpy = jest.spyOn(store, 'addStatsData');
            store.addStatsData(fakeStatsData);
            store.state$.subscribe((state) => {
                expect(state.statsData.length).toBe(3);
                done();
            });
            expect(addStatsDataSpy).toHaveBeenCalledWith([
                { label: 'Bandwidth Used', value: '114.42 MB', icon: 'insert_chart_outlined' },
                { label: 'Requests Served', value: '130', icon: 'file_download' },
                { label: 'Cache Hit Rate', value: '14.62%', icon: 'file_download' }
            ]);
        });

        fit('should return requested chart data', () => {
            const storeSpy = jest.spyOn(store, 'addChartData');
            const dotCdnServiceSpy = jest.spyOn(dotCdnService, 'requestStats');

            store.getChartStats('30');
            store.state$.subscribe(console.log);
            expect(dotCdnServiceSpy).toHaveBeenCalledWith('30');
        });

        fit('should dispatch loading, loaded and idle state', (done) => {
            const dispatchLoadingSpy = jest.spyOn(store, 'dispatchLoading');

            store.dispatchLoading({ loadingState: LoadingState.IDLE, loader: Loader.CHART });
            store.state$.subscribe((state) => {
                expect(state.isChartLoading).toBe(false);
            });

            store.dispatchLoading({ loadingState: LoadingState.LOADING, loader: Loader.CHART });
            store.state$.subscribe((state) => {
                expect(state.isChartLoading).toBe(true);
            });

            store.dispatchLoading({ loadingState: LoadingState.LOADED, loader: Loader.CHART });
            store.state$.subscribe((state) => {
                expect(state.isChartLoading).toBe(false);
                done();
            });

            expect(dispatchLoadingSpy).toHaveBeenCalledWith({
                loadingState: LoadingState.IDLE,
                loader: Loader.CHART
            });
            expect(dispatchLoadingSpy).toHaveBeenCalledWith({
                loadingState: LoadingState.LOADING,
                loader: Loader.CHART
            });
            expect(dispatchLoadingSpy).toHaveBeenCalledWith({
                loadingState: LoadingState.LOADED,
                loader: Loader.CHART
            });
        });
    });
});
