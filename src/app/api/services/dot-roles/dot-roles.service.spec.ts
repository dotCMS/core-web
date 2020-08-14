import { DotRolesService } from './dot-roles.service';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions, Response, ResponseOptions} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DotRole } from '@models/dot-role/dot-role.model';
import { TestBed } from '@angular/core/testing';
import { CoreWebService } from 'dotcms-js';
import { CoreWebServiceMock } from '../../../../../projects/dotcms-js/src/lib/core/core-web.service.mock';

const mockRoles: DotRole[] = [{ id: '1', name: 'Anonymous User' }, { id: '2', name: 'Other User' }];

describe('DotRolesService', () => {
    let service: DotRolesService;
    let connectionBackend: MockBackend;
    let lastConnection;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DotRolesService,
                { provide: ConnectionBackend, useClass: MockBackend },
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                { provide: RequestOptions, useClass: BaseRequestOptions },
                Http
            ]
        });
        service = TestBed.get(DotRolesService);
        connectionBackend = TestBed.get(ConnectionBackend);
        connectionBackend.connections.subscribe((connection: any) => (lastConnection = connection));
    });

    it('should get Roles', () => {
        let result;
        const url = '/api/role/users/id/123';

        service.get('123').subscribe(res => {
            result = res;
        });

        lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: { entity: mockRoles }
                })
            )
        );

        expect(result).toEqual(mockRoles);
        expect(lastConnection.request.method).toBe(0); // 0 is GET method
        expect(lastConnection.request.url).toBe(url);
    });
});
