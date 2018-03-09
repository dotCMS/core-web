import { DotPersonasService } from './dot-personas.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DotPersona } from '../../../shared/models/dot-persona/dot-persona.model';

describe('DotPersonasService', () => {
    const persona: DotPersona = {
        identifier: 'test'
    };

    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotPersonasService]);
        this.dotPersonasService = this.injector.get(DotPersonasService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Languages', () => {
        let result;

        this.dotPersonasService.get().subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {
                        contentlets: [persona]
                    }
                })
            )
        );
        expect(result).toEqual(Array.of(persona));
    });
});
