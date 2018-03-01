import { DotPersonasService } from './dot-personas.service';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('DotPersonasService', () => {
    const persona = {
        folder: 'test',
        host: 'test',
        identifier: 'test',
        inode: 'test',
        keyTag: 'test',
        languageId: 1,
        lastReview: 'test',
        modDate: 'test',
        modUser: 'test',
        name: 'test',
        owner: 'test',
        sortOrder: 1,
        stInode: 'test'
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
