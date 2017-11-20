import { ResponseView } from 'dotcms-js/dotcms-js';
import { MockBackend } from '@angular/http/testing';
import { ConnectionBackend, ResponseOptions } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { PageViewService } from './page-view.service';
import { DOTTestBed } from './../../../test/dot-test-bed';

describe('PageViewService', () => {
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

        expect(this.lastConnection.request.url).toContain('v1/page/render/about-us');
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
});
