import { ActivatedRoute } from '@angular/router';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { CoreWebService, LoginService } from 'dotcms-js/dotcms-js';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotInterceptor } from './dot-interceptor.service';
import { DotRouterService } from '../dot-router-service';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject } from '@angular/core/testing';
import { LoginServiceMock } from '../../../test/login-service.mock';

fdescribe('DotInterceptorService', () => {
    let lastConnection: any;
    let service: DotInterceptor;
    let backend: MockBackend;
    let corewebService: CoreWebService;

    beforeEach(() => {
        const testbed = DOTTestBed.configureTestingModule({
            providers: [
                DotInterceptor,
                DotRouterService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ],
            imports: [RouterTestingModule]
        });
        service = testbed.get(DotInterceptor);
        backend = testbed.get(ConnectionBackend) as MockBackend;
        backend.connections.subscribe((connection: any) => (lastConnection = connection));
        corewebService = testbed.get(CoreWebService);
    });

    it('should call core-web.service request', () => {
        spyOn(corewebService, 'requestView').and.callThrough();

        service.request({ url: 'test', method: 'get' }).subscribe();
        lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: {}
                })
            )
        );

        expect(corewebService.requestView).toHaveBeenCalledTimes(1);
    });

    it('should handle 401 when user is login', () => {
        spyOn(corewebService, 'requestView').and.callThrough();

        service.request({ url: 'test', method: 'get' }).subscribe();
        lastConnection.mockError(
            new Response(
                new ResponseOptions({
                    body: {},
                    status: 401
                })
            )
        );
    });
});
