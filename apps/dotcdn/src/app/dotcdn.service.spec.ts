import { TestBed } from '@angular/core/testing';
import { CoreWebService, DotCMSResponse, ResponseView, SiteService } from '@dotcms/dotcms-js';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DotCDNService } from './dotcdn.service';
import { SiteServiceMock, CoreWebServiceMock } from '@dotcms/dotcms-js';
import { of } from 'rxjs';
import { DotCDNStats } from './app.models';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

const mockDotApps = [
    {
        allowExtraParams: true,
        configurationsCount: 0,
        key: 'google-calendar',
        name: 'Google Calendar',
        description: 'It is a tool to keep track of your events',
        iconUrl: '/dA/d948d85c-3bc8-4d85-b0aa-0e989b9ae235/photo/surfer-profile.jpg'
    },
    {
        allowExtraParams: true,
        configurationsCount: 1,
        key: 'asana',
        name: 'Asana',
        description: 'It is asana to keep track of your asana events',
        iconUrl: '/dA/792c7c9f-6b6f-427b-80ff-1643376c9999/photo/mountain-persona.jpg'
    }
];

const fakeDotCDNViewData = {
    resp: {
        headers: {
            normalizedNames: {},
            lazyUpdate: null
        },
        status: 200,
        statusText: 'OK',
        url:
            'http://localhost:4200/api/v1/dotcdn/stats?hostId=48190c8c-42c4-46af-8d1a-0cd5db894797&dateFrom=2021-04-16&dateTo=2021-05-01',
        ok: true,
        type: 4,
        body: {
            entity: {
                stats: {
                    bandwidthPretty: '238.85 MB',
                    bandwidthUsedChart: {
                        '2021-04-16T00:00:00Z': 15506849,
                        '2021-04-17T00:00:00Z': 0,
                        '2021-04-18T00:00:00Z': 0,
                        '2021-04-19T00:00:00Z': 15301470,
                        '2021-04-20T00:00:00Z': 5061682,
                        '2021-04-21T00:00:00Z': 0,
                        '2021-04-22T00:00:00Z': 0,
                        '2021-04-23T00:00:00Z': 0,
                        '2021-04-24T00:00:00Z': 0,
                        '2021-04-25T00:00:00Z': 0,
                        '2021-04-26T00:00:00Z': 0,
                        '2021-04-27T00:00:00Z': 0,
                        '2021-04-28T00:00:00Z': 110186951,
                        '2021-04-29T00:00:00Z': 92793786,
                        '2021-04-30T00:00:00Z': 0,
                        '2021-05-01T00:00:00Z': 0
                    },
                    cacheHitRate: 64.58333333333334,
                    cdnDomain: 'https://erick-demo.b-cdn.net',
                    dateFrom: '2021-04-15T22:00:00Z',
                    dateTo: '2021-04-30T22:00:00Z',
                    geographicDistribution: {
                        NA: {
                            ' Miami, FL': 238850738
                        }
                    },
                    requestsServedChart: {
                        '2021-04-16T00:00:00Z': 3,
                        '2021-04-17T00:00:00Z': 0,
                        '2021-04-18T00:00:00Z': 0,
                        '2021-04-19T00:00:00Z': 6,
                        '2021-04-20T00:00:00Z': 3,
                        '2021-04-21T00:00:00Z': 0,
                        '2021-04-22T00:00:00Z': 0,
                        '2021-04-23T00:00:00Z': 0,
                        '2021-04-24T00:00:00Z': 0,
                        '2021-04-25T00:00:00Z': 0,
                        '2021-04-26T00:00:00Z': 0,
                        '2021-04-27T00:00:00Z': 0,
                        '2021-04-28T00:00:00Z': 19,
                        '2021-04-29T00:00:00Z': 17,
                        '2021-04-30T00:00:00Z': 0,
                        '2021-05-01T00:00:00Z': 0
                    },
                    totalBandwidthUsed: 238850738,
                    totalRequestsServed: 48
                }
            },
            errors: [],
            i18nMessagesMap: {},
            messages: [],
            permissions: []
        }
    },
    bodyJsonObject: {
        entity: {
            stats: {
                bandwidthPretty: '238.85 MB',
                bandwidthUsedChart: {
                    '2021-04-16T00:00:00Z': 15506849,
                    '2021-04-17T00:00:00Z': 0,
                    '2021-04-18T00:00:00Z': 0,
                    '2021-04-19T00:00:00Z': 15301470,
                    '2021-04-20T00:00:00Z': 5061682,
                    '2021-04-21T00:00:00Z': 0,
                    '2021-04-22T00:00:00Z': 0,
                    '2021-04-23T00:00:00Z': 0,
                    '2021-04-24T00:00:00Z': 0,
                    '2021-04-25T00:00:00Z': 0,
                    '2021-04-26T00:00:00Z': 0,
                    '2021-04-27T00:00:00Z': 0,
                    '2021-04-28T00:00:00Z': 110186951,
                    '2021-04-29T00:00:00Z': 92793786,
                    '2021-04-30T00:00:00Z': 0,
                    '2021-05-01T00:00:00Z': 0
                },
                cacheHitRate: 64.58333333333334,
                cdnDomain: 'https://erick-demo.b-cdn.net',
                dateFrom: '2021-04-15T22:00:00Z',
                dateTo: '2021-04-30T22:00:00Z',
                geographicDistribution: {
                    NA: {
                        ' Miami, FL': 238850738
                    }
                },
                requestsServedChart: {
                    '2021-04-16T00:00:00Z': 3,
                    '2021-04-17T00:00:00Z': 0,
                    '2021-04-18T00:00:00Z': 0,
                    '2021-04-19T00:00:00Z': 6,
                    '2021-04-20T00:00:00Z': 3,
                    '2021-04-21T00:00:00Z': 0,
                    '2021-04-22T00:00:00Z': 0,
                    '2021-04-23T00:00:00Z': 0,
                    '2021-04-24T00:00:00Z': 0,
                    '2021-04-25T00:00:00Z': 0,
                    '2021-04-26T00:00:00Z': 0,
                    '2021-04-27T00:00:00Z': 0,
                    '2021-04-28T00:00:00Z': 19,
                    '2021-04-29T00:00:00Z': 17,
                    '2021-04-30T00:00:00Z': 0,
                    '2021-05-01T00:00:00Z': 0
                },
                totalBandwidthUsed: 238850738,
                totalRequestsServed: 48
            }
        },
        errors: [],
        i18nMessagesMap: {},
        messages: [],
        permissions: []
    },
    headers: {
        normalizedNames: {},
        lazyUpdate: null
    }
};

fdescribe('DotcdnService', () => {
    let service: DotCDNService;
    let dotSiteService: SiteService;
    let dotCoreWebService: CoreWebService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                { provide: SiteService, useClass: SiteServiceMock }
            ]
        });
        service = TestBed.inject(DotCDNService);
        dotSiteService = TestBed.inject(SiteService);
        dotCoreWebService = TestBed.inject(CoreWebService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    fit('should return stats', (done) => {
        // const r = new ResponseView<DotCDNStats>(fakeDotCDNViewData);
        jest.spyOn(dotSiteService, 'getCurrentSite');
        jest.spyOn(dotCoreWebService, 'requestView');

        const {
            bodyJsonObject: { entity }
        } = fakeDotCDNViewData;

        const period = '30'

        const dateTo = moment().format('YYYY-MM-DD');
        const dateFrom = moment().subtract(period, 'd').format('YYYY-MM-DD');

        service.requestStats(period).subscribe((value) => {
            expect(value).toStrictEqual(entity);
            done();
        });

        const req = httpMock.expectOne(
            `/api/v1/dotcdn/stats?hostId=123-xyz-567-xxl&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );

        req.flush({ entity });
    });

    xit('should be created', () => {
        expect(service).toBeTruthy();
    });

    xit('should return an object with stats', () => {
        pending();
    });
});