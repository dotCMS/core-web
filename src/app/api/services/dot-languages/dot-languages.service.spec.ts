import { DotLanguagesService } from './dot-languages.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('DotLanguagesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotLanguagesService]);
        this.dotLanguagesService = this.injector.get(DotLanguagesService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Languages', () => {
        let result;

        this.dotLanguagesService.get().subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        en: { name: 'English' }
                    }
                })
            )
        );

        expect(result).toEqual([{ id: 'en', label: 'English' }]);
    });
});
