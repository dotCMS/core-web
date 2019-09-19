import { of } from 'rxjs';
import { ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LoginService } from 'dotcms-js';

import { DOTTestBed } from '@tests/dot-test-bed';
import { DotContentletLockerService } from '@services/dot-contentlet-locker/dot-contentlet-locker.service';
import { DotPageStateService } from './dot-page-state.service';
import { DotPageRenderService } from '@services/dot-page-render/dot-page-render.service';
import { DotPageMode } from '@portlets/dot-edit-page/shared/models/dot-page-mode.enum';
import { DotPageRenderState } from '@portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { LoginServiceMock } from '@tests/login-service.mock';
import { mockDotRenderedPage } from '@tests/dot-page-render.mock';
import { dotcmsContentletMock } from '@tests/dotcms-contentlet.mock';
import { mockUser } from '@tests/login-service.mock';
import * as _ from 'lodash';
import { mockDotPersona } from '@tests/dot-persona.mock';
import { DotDevice } from '@shared/models/dot-device/dot-device.model';
import { DotPersona } from '@shared/models/dot-persona/dot-persona.model';

const getDotPageRenderStateMock = () => {
    return new DotPageRenderState(mockUser, mockDotRenderedPage);
};

describe('DotPageStateService', () => {
    let service: DotPageStateService;
    let loginService: LoginService;
    let backend: MockBackend;
    let dotPageRenderService: DotPageRenderService;
    let dotContentletLockerService: DotContentletLockerService;
    let lastConnection;
    let injector;
    let dotPageRenderServiceGetSpy;

    beforeEach(() => {
        lastConnection = [];

        injector = DOTTestBed.configureTestingModule({
            providers: [
                DotPageStateService,
                DotPageRenderService,
                DotContentletLockerService,
                {
                    provide: LoginService,
                    useClass: LoginServiceMock
                }
            ]
        });

        service = injector.get(DotPageStateService);
        backend = injector.get(ConnectionBackend) as MockBackend;
        loginService = injector.get(LoginService);
        dotPageRenderService = injector.get(DotPageRenderService);
        dotContentletLockerService = injector.get(DotContentletLockerService);
        backend.connections.subscribe((connection: any) => {
            lastConnection.push(connection);
        });

        dotPageRenderServiceGetSpy = spyOn(dotPageRenderService, 'get').and.returnValue(
            of(mockDotRenderedPage)
        );
    });

    describe('$state', () => {
        it('should get state', () => {
            const mock = getDotPageRenderStateMock();

            console.log(mock);

            service.state$.subscribe((state: DotPageRenderState) => {
                console.log(state);
                expect(state).toEqual(mock);
            });
            service.get({
                url: 'some/url/test'
            });
        });

        it('should reload', () => {
            service.get({
                url: '/an/url/test'
            });
            service.reload();
            expect(dotPageRenderServiceGetSpy).toHaveBeenCalledWith({
                mode: 'PREVIEW_MODE',
                url: '/an/url/test'
            });
        });
    });

    describe('setters', () => {
        beforeEach(() => {
            service.get({
                url: 'some/url/test'
            });
        });

        describe('setLock', () => {
            it('should lock', () => {
                spyOn(dotContentletLockerService, 'lock').and.returnValue(
                    of({
                        message: 'locked'
                    })
                );
                service.setLock(
                    {
                        mode: DotPageMode.LIVE
                    },
                    true
                );

                expect(dotContentletLockerService.lock).toHaveBeenCalledWith('2');
                expect(dotPageRenderServiceGetSpy).toHaveBeenCalledWith({
                    mode: 'ADMIN_MODE',
                    url: '/an/url/test'
                });
            });

            it('should unlock', () => {
                spyOn(dotContentletLockerService, 'unlock').and.returnValue(
                    of({
                        message: 'unlocked'
                    })
                );
                service.setLock(
                    {
                        mode: DotPageMode.PREVIEW
                    },
                    false
                );

                expect(dotContentletLockerService.unlock).toHaveBeenCalledWith('2');
                expect(dotPageRenderServiceGetSpy).toHaveBeenCalledWith({
                    mode: 'PREVIEW_MODE',
                    url: '/an/url/test'
                });
            });
        });

        describe('setDevice', () => {
            it('should set iPad', () => {
                const device: DotDevice = {
                    inode: '',
                    name: 'iPad',
                    cssHeight: '',
                    cssWidth: ''
                };

                service.setDevice(device);

                expect(dotPageRenderServiceGetSpy).toHaveBeenCalledWith({
                    viewAs: {
                        device: device
                    },
                    url: '/an/url/test'
                });
            });
        });

        describe('setLanguage', () => {
            it('should set laguage 1', () => {
                service.setLanguage(1);

                expect(dotPageRenderServiceGetSpy).toHaveBeenCalledWith({
                    viewAs: {
                        language: 1
                    },
                    url: '/an/url/test'
                });
            });
        });

        describe('setPersona', () => {
            it('should set persona', () => {
                const persona: DotPersona = {
                    ...dotcmsContentletMock,
                    keyTag: 'persona',
                    name: 'persona',
                    personalized: false
                };
                service.setPersona(persona);

                expect(dotPageRenderServiceGetSpy).toHaveBeenCalledWith({
                    viewAs: {
                        persona: persona
                    },
                    url: '/an/url/test'
                });
            });
        });
    });

    describe('internal navigation state', () => {
        it('should return content from setted internal state', () => {
            const renderedPage = getDotPageRenderStateMock();
            service.setInternalNavigationState(renderedPage);

            expect(service.getInternalNavigationState()).toEqual(renderedPage);
            expect(dotPageRenderServiceGetSpy).not.toHaveBeenCalled();
        });

        it('should return null when internal state is not set', () => {
            expect(service.getInternalNavigationState()).toEqual(null);
            expect(dotPageRenderServiceGetSpy).not.toHaveBeenCalled();
        });
    });

    describe('setting local state', () => {
        it('should set local state and emit', () => {
            const renderedPage = getDotPageRenderStateMock();

            service.state$.subscribe((state: DotPageRenderState) => {
                expect(state).toEqual(renderedPage);
            });

            service.setLocalState(renderedPage);
        });
    });

    describe('login as user', () => {
        beforeEach(() => {
            spyOnProperty(loginService, 'auth', 'get').and.returnValue({
                loginAsUser: {
                    userId: 'login-as-user'
                },
                user: {
                    userId: '123'
                }
            });
        });

        it('should set lockedByAnotherUser', () => {
            service.state$.subscribe(({ state }: DotPageRenderState) => {
                expect(state.lockedByAnotherUser).toBe(true);
                expect(state.locked).toBe(true);
            });

            service.get({
                url: '/test/123'
            });
        });
    });

    describe('content added/removed', () => {
        describe('selected persona is not default', () => {
            it('should trigger haceContent as true', () => {
                const renderedPage = getDotPageRenderStateMock();
                service.setLocalState(renderedPage);

                const subscribeCallback = jasmine.createSpy('spy');
                service.haveContent$.subscribe(subscribeCallback);

                expect(subscribeCallback).toHaveBeenCalledWith(true);

                service.contentRemoved();

                expect(subscribeCallback).toHaveBeenCalledWith(false);
                expect(subscribeCallback).toHaveBeenCalledTimes(2);
            });

            it('should trigger haceContent as false', () => {
                const renderedPage = new DotPageRenderState(mockUser, {
                    ...mockDotRenderedPage,
                    ...{
                        numberContents: 0
                    }
                });
                service.setLocalState(renderedPage);

                const subscribeCallback = jasmine.createSpy('spy');
                service.haveContent$.subscribe(subscribeCallback);

                expect(subscribeCallback).toHaveBeenCalledWith(false);

                service.contentAdded();
                expect(subscribeCallback).toHaveBeenCalledWith(true);
                expect(subscribeCallback).toHaveBeenCalledTimes(2);
            });
        });

        describe('selected persona is not default', () => {
            it('should trigger haceContent as false', () => {
                const renderedPage = new DotPageRenderState(mockUser, {
                    ...mockDotRenderedPage,
                    ...{
                        viewAs: {
                            ...mockDotRenderedPage.viewAs,
                            persona: mockDotPersona
                        }
                    }
                });
                service.setLocalState(renderedPage);

                const subscribeCallback = jasmine.createSpy('spy');
                service.haveContent$.subscribe(subscribeCallback);

                expect(subscribeCallback).toHaveBeenCalledWith(false);

                service.contentRemoved();
                expect(subscribeCallback).toHaveBeenCalledTimes(1);
            });

            it('should trigger haceContent as true', () => {
                const renderedPage = new DotPageRenderState(mockUser, {
                    ...mockDotRenderedPage,
                    ...{
                        viewAs: {
                            ...mockDotRenderedPage.viewAs,
                            persona: mockDotPersona
                        }
                    },
                    ...{
                        numberContents: 0
                    }
                });
                service.setLocalState(renderedPage);

                const subscribeCallback = jasmine.createSpy('spy');
                service.haveContent$.subscribe(subscribeCallback);

                expect(subscribeCallback).toHaveBeenCalledWith(false);

                service.contentAdded();
                expect(subscribeCallback).toHaveBeenCalledTimes(1);
            });
        });
    });
});
