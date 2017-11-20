import { PageView } from './../../../portlets/dot-edit-page/shared/models/page-view.model';
import { ResponseView } from 'dotcms-js/dotcms-js';
import { MockBackend } from '@angular/http/testing';
import { ConnectionBackend, ResponseOptions } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { PageViewService } from './page-view.service';
import { DOTTestBed } from './../../../test/dot-test-bed';

fdescribe('PageViewService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([
            PageViewService
        ]);

        this.pageViewService =  this.injector.get(PageViewService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    });

    it('should do a get request with url param', () => {
        let result: any;
        this.pageViewService.get('about-us').subscribe(items => result = items);

        expect(this.lastConnection.request.url).toContain('v1/page/render/about-us?live=false');
    });

    xit('should do a get request and return a pageView', fakeAsync(() => {
        let result: any;

        this.pageViewService.get('about-us').subscribe(items => result = items);

        const mockResponse = {
            containers: [],
            layout: {},
            page: {},
            site: {},
            template: {}
        };

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({
                entity: mockResponse
            }),
        })));

        tick();

        expect(result).toEqual(mockResponse);
    }));

    xit('should post data and return an entity', fakeAsync(() => {
        let result;
        const mockPageView = {
            layout: {
                body: {
                    containers: ['string1', 'string2'],
                    rows: ['column']
                }
            },
            page: {
                identifier: 'test38923-82393842-23823'
            }
        };

        const mockResponse = {
            entity: [
                Object.assign({}, mockPageView, {
                    'iDate': 1495670226000,
                    'identifier': '1234-id-7890-entifier',
                    'modDate': 1495670226000
                })
            ]
        };

        this.pageViewService.save(mockPageView).subscribe(res => {
            console.log('res: ', res);
            result = res;
        });
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
        })));

        tick();
        console.log('Mock Response: ', mockResponse.entity[0]);

        expect(this.lastConnection.request.url).toContain('v1/page/test38923-82393842-23823/layout');
        expect(result[0]).toEqual(mockResponse.entity[0]);
    }));
});
