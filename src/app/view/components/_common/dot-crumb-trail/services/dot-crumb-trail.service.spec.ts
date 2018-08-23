import { TestBed } from '@angular/core/testing';
import { CrumbTrailService, DotCrumbTrail } from './dot-crumb-trail.service';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { Injectable } from '@angular/core';
import { LoginService, Auth } from 'dotcms-js/dotcms-js';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { mockUser } from '../../../../../test/login-service.mock';
import { Subject } from 'rxjs/Subject';
import { mockData } from './test-data';
import { DotMenuItem } from '../../../../../shared/models/navigation/menu-item.model';
import { DotMenu } from '../../../../../shared/models/navigation/menu.model';

@Injectable()
class MockLoginService {
    private auth = new Subject<Auth>();

    get auth$(): Observable<Auth> {
        return this.auth.asObservable();
    }
}

@Injectable()
class MockMenuService {
    getDotMenuItem(portletId: string): Observable<DotMenuItem> {
        if (portletId === 'content-types-angular') {
            return Observable.of(<DotMenuItem> {
                label: 'Content Types',
            });
        } else if (portletId === 'categories') {
            return Observable.of(<DotMenuItem> {
                label: 'Categories',
            });
        }

        throw new Error('Argument unvalid');
    }

    getDotMenu(portletId: string): Observable<DotMenu> {
        if (portletId === 'content-types-angular' || portletId === 'categories') {
            return Observable.of(<DotMenu> {
                name: 'Types & Tags'
            });
        }

        throw new Error('Argument unvalid');
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

fdescribe('CrumbTrailService', () => {
    let crumbTrailService: CrumbTrailService;
    const router = new MockRouter();

    const messageServiceMock = new MockDotMessageService({
        'content-types': 'Content Types',
        'categories': 'Categories',
        'create-content': 'Create Content',
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrumbTrailService,
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                },
                {
                    provide: LoginService,
                    useClass: MockLoginService
                },
                {
                    provide: DotMenuService,
                    useClass: MockMenuService
                },
                {
                    provide: Router,
                    useValue: router
                }
            ]
        });

        crumbTrailService = TestBed.get(CrumbTrailService);
    });

    it('should tigger crumb trails changed event', () => {
        let countCalled = 0;

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            console.log('crumbTrails', crumbTrail);
            countCalled++;

            if (crumbTrail.crumbs.length > 0) {
               expect(crumbTrail).toEqual(
                    {
                        crumbs: [{
                            label: 'Content Types',
                            url: '/dotAdmin/#/content-types-angular',
                            messageKey: 'content-types-angular',
                            dataId: undefined,
                            queryParams: undefined
                        }],
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
                        crumbs: [{
                            label: 'Categories',
                            url: '/dotAdmin/#/c/categories',
                            messageKey: 'categories',
                            dataId: undefined,
                            queryParams: undefined
                        }],
                        parentMenuLabel: 'Types & Tags'
                    }
                );
            }
        });

        crumbTrailService.activatedRoute = mockData['categories'];
        router.trigger(new NavigationEnd(1, mockData['categories'].state.url, mockData['categories'].state.url));
        expect(countCalled).toBe(2);
    });

    fit('should create a crumb trail when push is call twice', () => {
        let countCalled = 0;
        crumbTrailService.activatedRoute = mockData['content-types'];
        router.trigger(new NavigationEnd(1, mockData['content-types'].state.url, mockData['content-types'].state.url));

        crumbTrailService.crumbTrail.subscribe((crumbTrail: DotCrumbTrail) => {
            console.log('crumbTrail', crumbTrail);
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrail).toEqual({
                    crumbs: [
                        {
                            label: 'Content Types',
                            url: '/dotAdmin/#/content-types-angular',
                            messageKey: 'content-types-angular',
                            dataId: undefined,
                            queryParams: undefined
                        }
                    ],
                    parentMenuLabel: 'Types & Tags'
                });
            } else {
                expect(crumbTrail).toEqual({
                    crumbs: [
                        {
                            label: 'Content Types',
                            url: '/dotAdmin/#/content-types-angular',
                            messageKey: 'content-types-angular',
                            dataId: undefined,
                            queryParams: undefined
                        },
                        {
                            label: 'Create Content',
                            url: '/dotAdmin/#/content-types-angular/create/content',
                            messageKey: 'create-content',
                            dataId: undefined,
                            queryParams: undefined
                        }
                    ],
                    parentMenuLabel: 'Types & Tags'
                });
            }
        });

        crumbTrailService.activatedRoute = mockData['content-types-create'];
        router.trigger(new NavigationEnd(2, mockData['content-types-create'].state.url, mockData['content-types-create'].state.url));
        expect(countCalled).toBe(2);
    });

   /*it('should create a crumb trail when push is call twice with completly disjoin url', () => {
        let countCalled = 0;
        crumbTrailService.push('/content-types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Content Types',
                        url: '/dotAdmin/#/content-types'
                    }
                ]);
            } else {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Content Types',
                        url: '/dotAdmin/#/content-types'
                    },
                    {
                        label: 'Categories',
                        url: '/dotAdmin/#/categories'
                    }
                ]);
            }
        });

        crumbTrailService.push('/categories');
        expect(countCalled).toBe(2);
    });

    it('should clean the crumb trails and set url', () => {
        let countCalled = 0;
        crumbTrailService.push('/content-types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Content Types',
                        url: '/dotAdmin/#/content-types'
                    }
                ]);
            } else {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Categories',
                        url: '/dotAdmin/#/categories'
                    }
                ]);
            }
        });

        crumbTrailService.clean('/categories');
        expect(countCalled).toBe(2);
    });

    it('should clean the crumb trails', () => {
        let countCalled = 0;
        crumbTrailService.push('/content-types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;

            if (countCalled === 1) {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Content Types',
                        url: '/dotAdmin/#/content-types'
                    }
                ]);
            } else {
                expect(crumbTrails).toEqual([]);
            }
        });

        crumbTrailService.clean();
        expect(countCalled).toBe(2);
    });

    it('should no crash if url not init with /', (done) => {
        crumbTrailService.push('content-types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            expect(crumbTrails).toEqual([
                {
                    label: 'Content Types',
                    url: 'content-types'
                }
            ]);

            done();
        });
    });

    it('should no crash if url not init with / and contain c', (done) => {
        crumbTrailService.push('c/content-types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            expect(crumbTrails).toEqual([
                {
                    label: 'C Content Types',
                    url: 'c/content-types'
                }
            ]);
            done();
        });
    });

    it('should ignore push when url is equal to lastUrl', () => {
        let countCalled = 0;

        crumbTrailService.push('/content-types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;
            expect(crumbTrails).toEqual([
                {
                    label: 'Content Types',
                    url: '/dotAdmin/#/content-types'
                }
            ]);
        });

        crumbTrailService.push('/content-types');

        expect(countCalled).toBe(1);
    });

    it('should not look for label when the label is pass', (done) => {
        crumbTrailService.push('/content-types', 'Types');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            expect(crumbTrails).toEqual([
                {
                    label: 'Types',
                    url: '/dotAdmin/#/content-types'
                }
            ]);

            done();
        });
    });

    it('should ignore query params for label', (done) => {
        crumbTrailService.push('/edit-page/content?url=%2Findex&language_id=1');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            expect(crumbTrails).toEqual([
                {
                    label: 'Edit Page Content',
                    url: '/dotAdmin/#/edit-page/content?url=%2Findex&language_id=1'
                }
            ]);

            done();
        });
    });

    it('should come back to previous state', () => {
        let countCalled = 0;

        crumbTrailService.push('/test');
        crumbTrailService.push('/content-types');
        crumbTrailService.push('/content-types/create/content');

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;
            console.log('crumbTrails', crumbTrails);
            if (countCalled === 1) {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Test',
                        url: '/dotAdmin/#/test'
                    },
                    {
                        label: 'Content Types',
                        url: '/dotAdmin/#/content-types'
                    },
                    {
                        label: 'Create Content',
                        url: '/dotAdmin/#/content-types/create/content'
                    }
                ]);
            } else {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Test',
                        url: '/dotAdmin/#/test'
                    },
                    {
                        label: 'Content Types',
                        url: '/dotAdmin/#/content-types'
                    }
                ]);
            }

        });

        crumbTrailService.push('/content-types');
        expect(countCalled).toBe(2);
    });*/

    // it('should clean when logout', () => {});

    // it('should change id url param to data name', () => {});

    // it('should exclude from crumb trail', () => {});
});
