import { Observable } from 'rxjs';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { PushPublishService } from './push-publish.service';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
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

    it('should get logged user', fakeAsync(() => {
        const mockCurrentUserResponse = {
            email: 'admin@dotcms.com',
            givenName: 'TEST',
            roleId: 'e7d23sde-5127-45fc-8123-d424fd510e3',
            surnaname: 'User',
            userId: 'testId'
        };
        let currentUser: any;
        this.pushPublishService.getCurrentUser().subscribe(user => {
            currentUser = user._body;
        });

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockCurrentUserResponse
        })));

        tick();
        expect(this.lastConnection.request.url).toContain('api/v1/users/current');
        expect(currentUser).toEqual(mockCurrentUserResponse);
    }));

    xit('should do a get request and return environments', fakeAsync(() => {
        // spyOn(this.pushPublishService, 'getCurrentUser').and.returnValue(Observable.of({
        //     roleId: '1234'
        // }));
        let result: any;
        this.pushPublishService.getEnvironments().subscribe(items => result = items);

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

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockResponse
        })));

        tick();
        expect(result).toEqual(mockResponse);
    }));

    it('should do a post request and push publish a content type item', fakeAsync(() => {
        let result: any;
        const mockResponse = {
            'errorMessages': [],
            'total': 1,
            'bundleId': '1234-id-7890-entifier',
            'errors': 0
        };

        const mockFormValue = {
            pushActionSelected: 'publish',
            publishdate: new Date,
            expiredate: new Date,
            environment: 'env1',
            forcePush: true
        };

        this.pushPublishService.pushPublishContent('1234567890', mockFormValue).subscribe(res => {
            result = res._body;
        });
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockResponse
        })));

        tick();
        expect(this.lastConnection.request.url).toContain('DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish');
        expect(result).toEqual(mockResponse);
    }));
});
