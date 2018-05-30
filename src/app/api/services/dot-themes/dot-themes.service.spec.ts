import { DotThemesService } from './dot-themes.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { ConnectionBackend, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { mockDotThemes } from '../../../test/dot-themes.mock';

describe('DotThemesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotThemesService]);
        this.dotThemesService = this.injector.get(DotThemesService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Themes', () => {
        let result;

        this.dotThemesService.get().subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        entity: mockDotThemes
                    }
                })
            )
        );

        expect(result).toEqual(mockDotThemes);
    });
});
