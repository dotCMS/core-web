import { TestBed } from '@angular/core/testing';
import { CrumbTrailService, DotCrumbTrail } from './dot-crumb-trail.service';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { Injectable } from '@angular/core';
import { LoginService, Auth } from 'dotcms-js/dotcms-js';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { mockData } from './test-data';
import { DotMenuItem } from '../../../../../shared/models/navigation/menu-item.model';
import { DotMenu } from '../../../../../shared/models/navigation/menu.model';

const menuItems = {
    'content-types-angular': {
        label: 'Content Types',
    },
    'categories': {
        label: 'Categories',
    },
    'site-browser': {
        label: 'Site Browser',
    }
};

const menus = {
    'content-types-angular': {
        name: 'Types & Tags'
    },
    'categories': {
        name: 'Types & Tags'
    },
    'site-browser': {
        name: 'Site'
    }
};

@Injectable()
class MockLoginService {
    private auth = new Subject<Auth>();

    get auth$(): Observable<Auth> {
        return this.auth.asObservable();
    }

    tiggerLogOut(): void {
        this.auth.next({
            user: null,
            loginAsUser: null
        });
    }
}

@Injectable()
class MockMenuService {
    getDotMenuItem(portletId: string): Observable<DotMenuItem> {
        return Observable.of(<DotMenuItem> menuItems[portletId]);
    }

    getDotMenu(portletId: string): Observable<DotMenu> {
        return Observable.of(<DotMenu> menus[portletId]);
    }
}

@Injectable()
class MockRouter {
    private events$ = new Subject<NavigationEnd>();

    get events(): Observable<NavigationEnd> {
        return this.events$.asObservable();
    }

    trigger(navigationEnd: NavigationEnd): void {
        this.events$.next(navigationEnd);
    }
}

describe('CrumbTrailService', () => {
    let crumbTrailService: CrumbTrailService;
    let router;
    let mockLoginService;

    const messageServiceMock = new MockDotMessageService({
        'content-types': 'Content Types',
        'categories': 'Categories',
        'create-content': 'Create Content',
        'edit-page-content': 'Edit Page Content',
        'edit': 'Edit',
        'edit-page': 'Edit Page',
    });

    beforeEach(() => {
        router = new MockRouter();
        mockLoginService = new MockLoginService();

        TestBed.configureTestingModule({
            providers: [
                CrumbTrailService,
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                },
                {
                    provide: DotMenuService,
                    useClass: MockMenuService
                },
                {
                    provide: Router,
                    useValue: router
                },
                {
                    provide: LoginService,
                    useValue: mockLoginService
                }
            ]
        });

        crumbTrailService = TestBed.get(CrumbTrailService);
        crumbTrailService.clean();
    });

    it('should tigger crumb trails changed event', () => {
        let countCalled = 0;

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            if (crumbTrail.crumbs.length > 0) {
               expect(crumbTrail).toEqual(
                    {
                        crumbs: [mockData['content-types'].crumb],
                        parentMenuLabel: 'Types & Tags'
                    }
                );
            } else {
                expect(crumbTrail).toEqual(
                    {
                        crumbs: []
                    }
                );
            }
        });

        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));
        expect(countCalled).toBe(2);
    });

    it('ignore c prefix por jsp url', () => {
        let countCalled = 0;
        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            if (crumbTrail.crumbs.length > 0) {
                expect(crumbTrail).toEqual(
                    {
                        crumbs: [mockData['categories'].crumb],
                        parentMenuLabel: 'Types & Tags'
                    }
                );
            }
        });

        crumbTrailService.activatedRoute = mockData['categories'];
        router.trigger(new NavigationEnd(1, mockData['categories'].state.url, mockData['categories'].state.url));
        expect(countCalled).toBe(2);
    });

    it('should create a crumb trail when push is call twice', () => {
        let countCalled = 0;
        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            } else {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb, mockData['content-types-create'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            }
        });

        crumbTrailService.activatedRoute = mockData['content-types-create'];
        router.trigger(new NavigationEnd(2, mockData['content-types-create'].state.url, mockData['content-types-create'].state.url));
        expect(countCalled).toBe(2);
    });

   it('should create a crumb trail when push is call twice with completly disjoin url', () => {
        let countCalled = 0;
        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            } else {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb, mockData['categories'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            }
        });

        crumbTrailService.activatedRoute = mockData['categories'];
        router.trigger(new NavigationEnd(1, mockData['categories'].state.url, mockData['categories'].state.url));

        expect(countCalled).toBe(2);
    });

    it('should clean the crumb trails', () => {
        let countCalled = 0;
        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            } else {
                expect(crumbTrail).toEqual({
                    crumbs: []
                });
            }
        });

        crumbTrailService.clean();
        expect(countCalled).toBe(2);
    });

    it('should ignore push when url is equal to lastUrl', () => {
        let countCalled = 0;

        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            expect(crumbTrail).toEqual({
                crumbs: [mockData['content-types'].crumb],
                parentMenuLabel: 'Types & Tags'
            });
        });

        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        expect(countCalled).toBe(1);
    });

    it('should ignore query params for label', (done) => {
        crumbTrailService.activatedRoute = mockData['edit-page'];
        router.trigger(new NavigationEnd(1, mockData['edit-page'].state.url, mockData['edit-page'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            expect(crumbTrail.crumbs[crumbTrail.crumbs.length - 1]).toEqual(mockData['edit-page'].crumb);

            done();
        });
    });

    it('should create all the crum trail at once', (done) => {
        crumbTrailService.activatedRoute = mockData['content-types-create'];
        router.trigger(new NavigationEnd(2, mockData['content-types-create'].state.url, mockData['content-types-create'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            expect(crumbTrail).toEqual({
                crumbs: [mockData['content-types'].crumb, mockData['content-types-create'].crumb],
                parentMenuLabel: 'Types & Tags'
            });

            done();
        });
    });

    it('should create all the edit-page crumb trail', (done) => {
        crumbTrailService.activatedRoute = mockData['edit-page'];
        router.trigger(new NavigationEnd(1, mockData['edit-page'].state.url, mockData['edit-page'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            expect(crumbTrail).toEqual({
                crumbs: [
                    {
                        label: 'Site Browser',
                        messageKey: 'site-browser',
                        url: '/dotAdmin/#/c/site-browser'
                    },
                    mockData['edit-page'].crumb
                ],
                parentMenuLabel: 'Site'
            });

            done();
        });
    });

    it('should come back to previous state', () => {
        let countCalled = 0;

        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        crumbTrailService.activatedRoute = mockData['content-types-create'];
        router.trigger(new NavigationEnd(2, mockData['content-types-create'].state.url, mockData['content-types-create'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb, mockData['content-types-create'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            } else {
                expect(crumbTrail).toEqual({
                    crumbs: [mockData['content-types'].crumb],
                    parentMenuLabel: 'Types & Tags'
                });
            }

        });

        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        expect(countCalled).toBe(2);
    });

    it('should clean when logout', (done) => {
        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        mockLoginService.tiggerLogOut();

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            expect(crumbTrail).toEqual({
                crumbs: []
            });

            done();
        });
    });

    it('should change id url param to data name', (done) => {
        crumbTrailService.activatedRoute = mockData['edit-content-type'];
        router.trigger(new NavigationEnd(1, mockData['edit-content-type'].state.url, mockData['edit-content-type'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            expect(crumbTrail).toEqual({
                crumbs: [
                    mockData['content-types'].crumb,
                    mockData['edit-content-type'].crumb
                ],
                parentMenuLabel: 'Types & Tags'
            });

            done();
        });
    });

    it('should exclude from crumb trail', (done) => {
        crumbTrailService.activatedRoute = mockData[ 'page-layout'];
        router.trigger(new NavigationEnd(1, mockData['page-layout'].state.url, mockData[ 'page-layout'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            expect(crumbTrail).toEqual({
                crumbs: [
                    {
                        label: 'Site Browser',
                        messageKey: 'site-browser',
                        url: '/dotAdmin/#/c/site-browser'
                    },
                    mockData['page-layout'].crumb
                ],
                parentMenuLabel: 'Site'
            });

            done();
        });
    });
});
