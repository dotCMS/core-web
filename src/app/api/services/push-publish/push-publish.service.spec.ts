import { Observable } from 'rxjs/Observable';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { PushPublishService } from './push-publish.service';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { DotCurrentUserService } from '../dot-current-user/dot-current-user.service';

describe('PushPublishService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([PushPublishService, DotCurrentUserService]);

        this.pushPublishService = this.injector.get(PushPublishService);
        this.dotCurrentUserService = this.injector.get(DotCurrentUserService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it(
        'should get push publish environments',
        fakeAsync(() => {
            spyOn(this.dotCurrentUserService, 'getCurrentUser').and.returnValue(
                Observable.of({
                    roleId: '1234'
                })
            );

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

            let result: any;
            this.pushPublishService.getEnvironments().subscribe((items) => (result = items));
            this.lastConnection.mockRespond(
                new Response(
                    new ResponseOptions({
                        body: JSON.stringify(mockResponse)
                    })
                )
            );

            tick();
            expect(this.lastConnection.request.url).toContain('api/environment/loadenvironments/roleId/1234/name=0');
            expect(result).toEqual(mockResponse.splice(1));
        })
    );

    it(
        'should do a post request and push publish an asset',
        fakeAsync(() => {
            let result: any;
            const mockResponse = {
                errorMessages: [],
                total: 1,
                bundleId: '1234-id-7890-entifier',
                errors: 0
            };

            const mockFormValue = {
                pushActionSelected: 'publish',
                publishdate: new Date(),
                expiredate: new Date(),
                environment: 'env1',
                forcePush: true
            };

            this.pushPublishService.pushPublishContent('1234567890', mockFormValue).subscribe((res) => {
                result = res._body;
            });
            this.lastConnection.mockRespond(
                new Response(
                    new ResponseOptions({
                        body: mockResponse
                    })
                )
            );

            tick();
            expect(this.lastConnection.request.url).toContain(
                'DotAjaxDirector/com.dotcms.publisher.ajax.RemotePublishAjaxAction/cmd/publish'
            );
            expect(result).toEqual(mockResponse);
        })
    );
});
