import { DotDialogService } from './../dot-dialog/dot-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { ConnectionBackend, ResponseOptions, Response } from '@angular/http';
import { CoreWebService, LoginService } from 'dotcms-js/dotcms-js';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotInterceptor } from './dot-interceptor.service';
import { DotRouterService } from '../dot-router-service';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject } from '@angular/core/testing';
import { DotMessageService } from '../dot-messages-service';
import { MockDotMessageService } from '../../../test/dot-message-service.mock';

describe('DotInterceptorService', () => {
    let lastConnection: any;
    let service: DotInterceptor;
    let backend: MockBackend;
    let corewebService: CoreWebService;
    let dotRouterService: DotRouterService;
    let dotDialogService: DotDialogService;
    let loginService: LoginService;

    const messageServiceMock = new MockDotMessageService({
        'dot.common.http.error.403.header': '403 Header',
        'dot.common.http.error.403.message': '403 Message',
        'dot.common.http.error.500.header': '500 Header',
        'dot.common.http.error.500.message': '500 Message'
    });

    beforeEach(() => {
        const testbed = DOTTestBed.configureTestingModule({
            providers: [
                DotInterceptor,
                DotRouterService,
                {
                    provide: LoginService,
                    useValue: {
                        auth: {
                            user: {
                                emailAddress: 'admin@dotcms.com',
                                firstName: 'Admin',
                                lastName: 'Admin',
                                loggedInDate: 123456789,
                                userId: '123'
                            }
                        }
                    }
                },
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                }
            ],
            imports: [RouterTestingModule]
        });
        service = testbed.get(DotInterceptor);
        backend = testbed.get(ConnectionBackend) as MockBackend;
        backend.connections.subscribe((connection: any) => (lastConnection = connection));
        corewebService = testbed.get(CoreWebService);
        dotRouterService = testbed.get(DotRouterService);
        dotDialogService = testbed.get(DotDialogService);
        loginService = testbed.get(LoginService);
        spyOn(corewebService, 'requestView').and.callThrough();
    });

    it('should call core-web.service request', () => {
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

    it('should handle 401 error when user is login', () => {
        spyOn(dotRouterService, 'goToMain');
        spyOn(dotDialogService, 'alert');

        service.request({ url: 'test', method: 'get' }).subscribe();
        lastConnection.mockError(
            new Response(
                new ResponseOptions({
                    body: {},
                    status: 401
                })
            )
        );

        expect(dotRouterService.goToMain).toHaveBeenCalledTimes(1);
        expect(dotDialogService.alert).toHaveBeenCalledWith({
            message: '403 Message',
            header: '403 Header'
        });
    });

    it('should handle 401 error when user is logout', () => {
        loginService.auth.user = null;
        spyOn(dotRouterService, 'goToLogin');
        spyOn(dotDialogService, 'alert');

        service.request({ url: 'test', method: 'get' }).subscribe();
        lastConnection.mockError(
            new Response(
                new ResponseOptions({
                    body: {},
                    status: 401
                })
            )
        );

        expect(dotDialogService.alert).not.toHaveBeenCalled();
        expect(dotRouterService.goToLogin).toHaveBeenCalledTimes(1);
    });

    it('should handle 403 error', () => {
        spyOn(dotDialogService, 'alert');

        service.request({ url: 'test', method: 'get' }).subscribe();
        lastConnection.mockError(
            new Response(
                new ResponseOptions({
                    body: {},
                    status: 403
                })
            )
        );

        expect(dotDialogService.alert).toHaveBeenCalledWith({
            message: '403 Message',
            header: '403 Header'
        });
    });

    it('should handle 500 error', () => {
        spyOn(dotDialogService, 'alert');

        service.request({ url: 'test', method: 'get' }).subscribe();
        lastConnection.mockError(
            new Response(
                new ResponseOptions({
                    body: {},
                    status: 500
                })
            )
        );

        expect(dotDialogService.alert).toHaveBeenCalledWith({
            message: '500 Message',
            header: '500 Header'
        });
    });
});
