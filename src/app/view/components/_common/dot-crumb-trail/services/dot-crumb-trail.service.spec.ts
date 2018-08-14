import { TestBed } from '@angular/core/testing';
import { CrumbTrailService, CrumbTrail } from './dot-crumb-trail.service';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';

fdescribe('CrumbTrailService', () => {
    let crumbTrailService: CrumbTrailService;

    const messageServiceMock = new MockDotMessageService({
        'content-types': 'Content Types',
        'categories': 'Categories',
        'create': 'Create',
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrumbTrailService,
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                }
            ]
        });

        crumbTrailService = TestBed.get(CrumbTrailService);
    });

    it('should tigger crumb trails changed event', () => {
        let countCalled = 0;

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;

            if (crumbTrails.length > 0) {
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

        crumbTrailService.push('/content-types');
        expect(countCalled).toBe(2);
    });

    it('ignore c prefix por jsp url', () => {
        let countCalled = 0;
        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;

            if (crumbTrails.length > 0) {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Categories',
                        url: '/dotAdmin/#/c/categories'
                    }
                ]);
            } else {
                expect(crumbTrails).toEqual([]);
            }
        });

        crumbTrailService.push('/c/categories');
        expect(countCalled).toBe(2);
    });

    it('should ignore c when it is not a prefix', () => {
        let countCalled = 0;

        crumbTrailService.crumbTrails.subscribe((crumbTrails: CrumbTrail[]) => {
            countCalled++;
            console.log('crumbTrails', crumbTrails);
            if (crumbTrails.length > 0) {
                expect(crumbTrails).toEqual([
                    {
                        label: 'Categories C',
                        url: '/dotAdmin/#/categories/c'
                    }
                ]);
            } else {
                expect(crumbTrails).toEqual([]);
            }
        });

        crumbTrailService.push('/categories/c');
        expect(countCalled).toBe(2);
    });

    it('should create a crumb trail when push is call twice', () => {
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
                        label: 'Create Content',
                        url: '/dotAdmin/#/content-types/create/content'
                    }
                ]);
            }
        });

        crumbTrailService.push('/content-types/create/content');
        expect(countCalled).toBe(2);
    });

   it('should create a crumb trail when push is call twice with completly disjoin url', () => {
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
    });
});
