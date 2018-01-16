import { DOTTestBed } from '../../../test/dot-test-bed';
import { PushPublishService } from './push-publish.service';
import { ConnectionBackend, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';

describe('PushPublishService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([
            PushPublishService
        ]);

        this.pushPublishService =  this.injector.get(PushPublishService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    });

    xit('should do a get request and return environments', fakeAsync(() => {
        let result: any;
        let currentUser: any;
        this.pushPublishService.getEnvironments().subscribe(items => result = items);
        this.pushPublishService.getCurrentUser().subscribe(user => currentUser = user);

        const mockResponse = [
            {
                name: '',
                id: '0'
            },
            {
                name: 'environment1',
                id: '1sdf5-23fs-dsf2-sf3oj23p4p42d'
            },
            {
                name: 'environment2',
                id: '1s24z-23fs-d232-sf334fdf4p42d'
            }
        ];

        const mockCurrentUserResponse = {
            email: 'admin@dotcms.com',
            givenName: 'Admin',
            roleId: 'e7d23sde-5127-45fc-8123-d424fd510e3',
            surnaname: 'User',
            userId: 'testId'
        };

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockResponse,
            url: 'api/v1/users/current/'
        })));

        tick();

        expect(currentUser).toEqual(mockCurrentUserResponse);
        expect(this.lastConnection.request.url).toContain('/api/v1/users/current/');
    }));

    xit('should do a post request and push publish a content type item', () => {
        let result: any;
        const mockContenType = {
            clazz: 'com.dotcms.contenttype.model.type.ImmutableSimpleContentType',
            id: '1234567890',
            name: 'Nuevo',
            variable: 'Nuevo',
            defaultType: false,
            fixed: false,
            folder: 'SYSTEM_FOLDER',
            host: null,
            owner: '123',
            system: false
        };

        const mockResponse = {
            entity: [
                Object.assign({}, mockContenType, {
                    'errorMessages': [],
                    'total': 1,
                    'bundleId': '1234-id-7890-entifier',
                    'errors': 0
                })
            ]
        };

        const mockFormValue = {
            pushActionSelected: 'publish',
            publishdate: '1495670226000',
            expiredate: '1495670226000',
            environment: 'env1',
            forcePush: true
        };

        this.pushPublishService.getFormattedDate(1495670226000);

        this.pushPublishService.pushPublishContent('test38923-82393842-23823', mockFormValue).subscribe(res => {
            result = res;
        });
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
        })));

        tick();
        expect(this.lastConnection.request.url).toContain('DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish');
        expect(result).toEqual(mockResponse.entity);
    });
});
