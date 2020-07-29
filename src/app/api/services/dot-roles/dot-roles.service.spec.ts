import { DotRolesService } from './dot-roles.service';
import { DOTTestBed } from '@tests/dot-test-bed';
import { ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DotRole } from '@models/dot-role/dot-role.model';
import { mockDotPersona } from '@tests/dot-persona.mock';

const mockRoles: DotRole[] = [{ id: '1', name: 'Anonymous User' }, { id: '2', name: 'Other User' }];

fdescribe('DotRolesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([DotRolesService]);
        this.dotRolesService = this.injector.get(DotRolesService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should get Roles', () => {
        let result;
        const url = '/api/role/users/id/123';

        this.dotRolesService.get('123').subscribe(res => {
            result = res;
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: { entity: mockRoles }
                })
            )
        );

        expect(result).toEqual(Array.of(mockDotPersona));
        expect(this.lastConnection.request.method).toBe(0); // 0 is GET method
        expect(this.lastConnection.request.url).toBe(url);
    });
});
