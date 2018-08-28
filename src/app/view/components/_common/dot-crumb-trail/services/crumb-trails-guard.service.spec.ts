import { TestBed } from '@angular/core/testing';
import { CrumbTrailsGuardService } from './crumb-trails-guard.service';
import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CrumbTrailService } from './dot-crumb-trail.service';

@Injectable()
export class CrumbTrailServiceMock {
    push = jasmine.createSpy('push');
}

describe('CrumbTrailsGuardService', () => {
    let crumbTrailsGuardService: CrumbTrailsGuardService;
    let crumbTrailService: CrumbTrailService;
    let mockRouterStateSnapshot: RouterStateSnapshot;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrumbTrailsGuardService,
                {
                    provide: CrumbTrailService,
                    useClass: CrumbTrailServiceMock
                }
            ]
        });

        crumbTrailsGuardService = TestBed.get(CrumbTrailsGuardService);
        crumbTrailService = TestBed.get(CrumbTrailService);
        mockRouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
        mockActivatedRouteSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', [
            'toString'
        ]);
    });

    it('should push then Crumb trails', () => {
        mockRouterStateSnapshot.url = '/test/test';
        crumbTrailsGuardService.canActivateChild(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(crumbTrailService.activatedRoute).toEqual(mockActivatedRouteSnapshot);
    });
});
