import { async, tick } from '@angular/core/testing';
import { DotMenuService } from '../../../api/services/dot-menu.service';
import { DotRouterService } from '../../../api/services/dot-router-service';
import { DotcmsEventsService, LoginService, CoreWebService } from 'dotcms-js/dotcms-js';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginServiceMock } from '../../../test/login-service.mock';
import { DotNavigationService } from './dot-navigation.service';
import { ReflectiveInjector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { TestBed } from '@angular/core/testing';
import { Auth, User } from 'dotcms-js/core/login.service';
import { fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { noUndefined } from '@angular/compiler/src/util';
import { DotMenu } from '../../../shared/models/navigation';

const mockMenu: DotMenu[] = [
    {
        id: '123',
        name: 'Parent 1',
        tabDescription: '',
        tabName: '',
        url: '',
        menuItems: [
            {
                ajax: true,
                angular: true,
                id: '',
                label: 'Child 1',
                url: 'hello/url',
                menuLink: ''
            }
        ],
        isOpen: true
    }
];

describe('DotNavigationService', () => {
    let dotMenuService: DotMenuService;
    let dotNavigationService: DotNavigationService;
    let dotRouterService: DotRouterService;
    let dotcmsEventsService: DotcmsEventsService;
    let loginService: LoginServiceMock;

    beforeEach(
        async(() => {
            const testbed = DOTTestBed.configureTestingModule({
                providers: [
                    DotRouterService,
                    DotNavigationService,
                    DotMenuService,
                    {
                        provide: LoginService,
                        useClass: LoginServiceMock
                    },
                    {
                        provide: Router,
                        useValue: {
                            routerState: {
                                snapshot: {
                                    url: 'hello/world'
                                }
                            },
                            events: Observable.of({})
                        }
                    }
                ],
                imports: [RouterTestingModule]
            });

            dotMenuService = testbed.get(DotMenuService);
            dotNavigationService = testbed.get(DotNavigationService);
            dotRouterService = testbed.get(DotRouterService);
            dotcmsEventsService = testbed.get(DotcmsEventsService);
            loginService = testbed.get(LoginService);
        })
    );

    it('should redirect to edit page', () => {
        spyOn(dotRouterService, 'gotoPortlet');
        spyOn(dotNavigationService, 'reloadNavigation');

        const mockUser = {
            emailAddress: 'admin@dotcms.com',
            firstName: 'Admin',
            lastName: 'Admin',
            loggedInDate: 123456789,
            userId: '123',
            editModeUrl: '/test/123'
        };
        const mockAuth: Auth = {
            loginAsUser: null,
            user: mockUser
        };
        loginService.triggerNewAuth(mockAuth);

        expect(dotNavigationService.reloadNavigation).toHaveBeenCalledWith(false);
        expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('edit-page/content?url=/test/123', true);
    });

    it('should redirect to previous saved URL and clear the saved url', fakeAsync(() => {
        spyOn(dotRouterService, 'gotoPortlet').and.callFake(() => {
            return new Promise(resolve => {
                resolve(true);
            });
        });
        spyOn(dotNavigationService, 'reloadNavigation');
        dotRouterService.previousSavedURL = 'hello/world';

        const mockUser = {
            emailAddress: 'admin@dotcms.com',
            firstName: 'Admin',
            lastName: 'Admin',
            loggedInDate: 123456789,
            userId: '123'
        };
        const mockAuth: Auth = {
            loginAsUser: null,
            user: mockUser
        };
        loginService.triggerNewAuth(mockAuth);

        tick();
        expect(dotNavigationService.reloadNavigation).toHaveBeenCalledWith(false);
        expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('hello/world', true);
        expect(dotRouterService.previousSavedURL === null).toBe(true);
    }));

    // TODO: needs to fix this, looks like the dotcmsEventsService instance is different here.
    xit('should subscribe to UPDATE_PORTLET_LAYOUTS websocket event', () => {
        spyOn(dotcmsEventsService, 'subscribeTo');
        expect(dotcmsEventsService.subscribeTo).toHaveBeenCalledWith('UPDATE_PORTLET_LAYOUTS');
    });

    it('should go to first portlet', () => {
        spyOn(dotMenuService, 'loadMenu').and.returnValue(Observable.of(mockMenu));

        spyOn(dotRouterService, 'gotoPortlet');
        dotNavigationService.goToFirstPortlet(false);
        expect(dotRouterService.gotoPortlet).toHaveBeenCalledWith('hello/url', false);
    });

    it('should return correct value in isActive', () => {
        expect(dotNavigationService.isActive('hello')).toBe(true);
    });

    it('should reload current portlet', () => {
        spyOn(dotRouterService, 'reloadCurrentPortlet');
        dotNavigationService.reloadCurrentPortlet('hello');

        expect(dotRouterService.reloadCurrentPortlet).toHaveBeenCalledWith('hello');
    });

    it('should NOT reload current portlet', () => {
        spyOn(dotRouterService, 'reloadCurrentPortlet');
        dotNavigationService.reloadCurrentPortlet('123');

        expect(dotRouterService.reloadCurrentPortlet).not.toHaveBeenCalled();
    });

    it('should reload navigation and set menu', () => {
        spyOn(dotMenuService, 'reloadMenu').and.returnValue(Observable.of(mockMenu));

        let result: DotMenu[];

        dotNavigationService.items$.subscribe((menu: DotMenu[]) => {
            result = menu;
        });

        dotNavigationService.reloadNavigation();

        expect(result).toEqual(mockMenu);
    });

    it('should reload navigation, set menu and redirect to first portlet', () => {
        spyOn(dotMenuService, 'reloadMenu').and.returnValue(Observable.of(mockMenu));
        spyOn(dotMenuService, 'isPortletInMenu').and.returnValue(Observable.of(false));
        spyOn(dotNavigationService, 'goToFirstPortlet').and.returnValue(Observable.of(false));

        dotNavigationService.reloadNavigation();
        expect(dotNavigationService.goToFirstPortlet).toHaveBeenCalledTimes(1);
    });

    it('should reload navigation, set menu and NOT redirect to first portlet (portlet is in menu)', () => {
        spyOn(dotMenuService, 'reloadMenu').and.returnValue(Observable.of(mockMenu));
        spyOn(dotMenuService, 'isPortletInMenu').and.returnValue(Observable.of(true));
        spyOn(dotNavigationService, 'goToFirstPortlet').and.returnValue(Observable.of(false));

        dotNavigationService.reloadNavigation();
        expect(dotNavigationService.goToFirstPortlet).not.toHaveBeenCalled();
    });

    it('should reload navigation, set menu and NOT redirect to first portlet (user redirect)', () => {
        spyOn(dotMenuService, 'reloadMenu').and.returnValue(Observable.of(mockMenu));
        spyOn(dotMenuService, 'isPortletInMenu').and.returnValue(Observable.of(false));
        spyOn(dotNavigationService, 'goToFirstPortlet').and.returnValue(Observable.of(false));

        dotNavigationService.reloadNavigation(false);
        expect(dotNavigationService.goToFirstPortlet).not.toHaveBeenCalled();
    });
});
