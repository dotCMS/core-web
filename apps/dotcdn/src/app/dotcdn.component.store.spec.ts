import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { of } from 'rxjs';
import { DotCDNStore } from './dotcdn.component.store';
import { DotCDNService } from './dotcdn.service';
import { SiteServiceMock, CoreWebServiceMock } from '@dotcms/dotcms-js';
import 'ts-jest/utils';

const fakeResponseData = {
    stats: {
        bandwidthPretty: '114.42 MB',
        cdnDomain: 'demo.dotcms.com',
        bandwidthUsedChart: {
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

const fakeAddBandwidthChartData = {
    datasets: [
        {
            label: 'Bandwidth Used',
            data: ['78554075', '15506849', '0', '0', '15301470', '5061682', '0', '0', '0'],
            borderColor: '#6f5fa3',
            fill: false
        }
    ],
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
    ]
};

const fakeAddRequestsChartData = {
    datasets: [
        {
            label: 'Requests Served',
            data: ['78554075', '15506849', '0', '0', '15301470', '5061682', '0', '0', '0'],
            borderColor: '#6f5fa3',
            fill: false
        }
    ],
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
    ]
};

const fakeStatsData = [
    { label: 'Bandwidth Used', value: '114.42 MB', icon: 'insert_chart_outlined' },
    { label: 'Requests Served', value: '130', icon: 'file_download' },
    { label: 'Cache Hit Rate', value: '14.62%', icon: 'file_download' }
];

const fakeStateViewModel = {
    chartBandwidthData: {
        labels: ['15/04', '16/04', '17/04', '18/04', '19/04', '20/04', '21/04', '22/04', '23/04'],
        datasets: [
            {
                label: 'Bandwidth Used',
                data: ['78.55', '15.51', '0.00', '0.00', '15.30', '5.06', '0.00', '0.00', '0.00'],
                borderColor: '#6f5fa3',
                fill: false
            }
        ]
    },
    chartRequestsData: {
        labels: ['15/04', '16/04', '17/04', '18/04', '19/04', '20/04', '21/04', '22/04', '23/04'],
        datasets: [
            {
                label: 'Requests Served',
                data: ['78554075', '15506849', '0', '0', '15301470', '5061682', '0', '0', '0'],
                borderColor: '#FFA726',
                fill: false
            }
        ]
    },
    statsData: [
        {
            label: 'Bandwidth Used',
            value: '114.42 MB',
            icon: 'insert_chart_outlined'
        },
        {
            label: 'Requests Served',
            value: '130',
            icon: 'file_download'
        },
        {
            label: 'Cache Hit Rate',
            value: '14.62%',
            icon: 'file_download'
        }
    ],
    isChartLoading: false,
    cdnDomain: 'demo.dotcms.com'
};

describe('DotCDNComponentStore', () => {
    let store: DotCDNStore;
    let dotCdnService: DotCDNService;

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

    describe('DotCDN Component Store', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        it('should return bandwidth chart state', (done) => {
            const addChartDataSpy = jest.spyOn(store, 'addChartBandwidthData');

            store.addChartBandwidthData(fakeAddBandwidthChartData);
            store.state$.subscribe((state) => {
                expect(state.chartBandwidthData.datasets.length).toBe(1);
                expect(state.chartBandwidthData.datasets[0].label).toEqual('Bandwidth Used');
                done();
            });

            expect(addChartDataSpy).toHaveBeenCalledWith(fakeAddBandwidthChartData);
        });

        it('should update the requests chart state', (done) => {
            jest.spyOn(store, 'addChartRequestData');
            store.addChartRequestData(fakeAddRequestsChartData);
            store.state$.subscribe((state) => {
                expect(state.chartRequestsData.datasets[0]).toEqual({
                    label: 'Requests Served',
                    data: ['78554075', '15506849', '0', '0', '15301470', '5061682', '0', '0', '0'],
                    borderColor: '#6f5fa3',
                    fill: false
                });
                done();
            });
        });

        it('should update the stats', (done) => {
            jest.spyOn(store, 'addStatsData');
            store.addStatsData(fakeStatsData);
            store.state$.subscribe((state) => {
                expect(state.statsData).toStrictEqual([
                    {
                        label: 'Bandwidth Used',
                        value: '114.42 MB',
                        icon: 'insert_chart_outlined'
                    },
                    { label: 'Requests Served', value: '130', icon: 'file_download' },
                    { label: 'Cache Hit Rate', value: '14.62%', icon: 'file_download' }
                ]);
                done();
            });
        });

        it('should set chart state', (done) => {
            jest.spyOn(dotCdnService, 'requestStats').mockReturnValue(of(fakeResponseData));
            jest.spyOn(store, 'addChartBandwidthData');
            jest.spyOn(store, 'addChartRequestData');

            store.getChartStats('30');

            expect(store.addChartBandwidthData).toHaveBeenCalledWith({
                datasets: [
                    {
                        borderColor: '#6f5fa3',
                        data: [
                            '78.55',
                            '15.51',
                            '0.00',
                            '0.00',
                            '15.30',
                            '5.06',
                            '0.00',
                            '0.00',
                            '0.00'
                        ],
                        fill: false,
                        label: 'Bandwidth Used'
                    }
                ],
                labels: [
                    '15/04',
                    '16/04',
                    '17/04',
                    '18/04',
                    '19/04',
                    '20/04',
                    '21/04',
                    '22/04',
                    '23/04'
                ]
            });

            expect(store.addChartRequestData).toHaveBeenCalledWith({
                labels: [
                    '15/04',
                    '16/04',
                    '17/04',
                    '18/04',
                    '19/04',
                    '20/04',
                    '21/04',
                    '22/04',
                    '23/04'
                ],
                datasets: [
                    {
                        label: 'Requests Served',
                        data: [
                            '78554075',
                            '15506849',
                            '0',
                            '0',
                            '15301470',
                            '5061682',
                            '0',
                            '0',
                            '0'
                        ],
                        borderColor: '#FFA726',
                        fill: false
                    }
                ]
            });

            store.vm$.subscribe((state) => {
                expect(state).toStrictEqual(fakeStateViewModel);
                done();
            });
        });

        it('should add domain to state', (done) => {
            store.addCdnDomain('demo.dotcms.com');

            store.state$.subscribe((state) => {
                expect(state.cdnDomain).toEqual('demo.dotcms.com');
                done();
            });
        });

        it('should purge cdn with urls', (done) => {
            const urls = ['url1, url2'];

            const dotCdnServiceSpy = jest.spyOn(dotCdnService, 'purgeCache').mockReturnValue(
                of({
                    entity: {
                        'All Urls Sent Purged: ': true
                    },
                    errors: [],
                    i18nMessagesMap: {},
                    messages: [],
                    permissions: []
                })
            );

            store.purgeCDNCache(urls);

            dotCdnServiceSpy.mock.results[0].value.subscribe((values) => {
                expect(values.entity['All Urls Sent Purged: ']).toBe(true);
                done();
            });

            expect(dotCdnService.purgeCache).toHaveBeenCalledWith(urls);
        });

        it('should purge all the cache', (done) => {
            const dotCdnServiceSpy = jest.spyOn(dotCdnService, 'purgeCacheAll').mockReturnValue(
                of({
                    entity: {
                        'Entire Cache Purged: ': true
                    },
                    errors: [],
                    i18nMessagesMap: {},
                    messages: [],
                    permissions: []
                })
            );

            store.purgeCDNCacheAll();

            dotCdnServiceSpy.mock.results[0].value.subscribe((values) => {
                expect(values.entity['Entire Cache Purged: ']).toBe(true);
                done();
            });

            expect(dotCdnService.purgeCacheAll).toHaveBeenCalledTimes(1);
        });
    });
});
