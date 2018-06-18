import { DotPageSelectorService } from './dot-page-selector.service';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { mockPageSelector } from '../dot-page-selector.component.spec';

describe('Service: DotPageSelector', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotPageSelectorService]);
        this.dotPageSelectorService = this.injector.get(DotPageSelectorService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Page Selectors', () => {
        let result;

        this.dotPageSelectorService.getPagesInFolder('about').subscribe((res) => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        contentlets: [mockPageSelector]
                    }
                })
            )
        );
        expect(result).toEqual(mockPageSelector);
    });

    it('should get a specific Page Selector', () => {
        let result;

        this.dotPageSelectorService.getPage('fdeb07ff-6fc3-4237-91d9-728109bc621d').subscribe((res) => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        contentlets: [mockPageSelector[0]]
                    }
                })
            )
        );
        expect(result).toEqual(mockPageSelector[0]);
    });
});
