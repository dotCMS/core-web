
import { DebugElement, Injectable } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DotCrumbTrailComponent } from './dot-crumb-trail.component';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { CrumbTrailService, DotCrumbTrail } from './services/dot-crumb-trail.service';

@Injectable()
class MockCrumbTrailService {
    get crumbTrail(): Observable<DotCrumbTrail> {
        return Observable.of(
            {
                crumbs: [
                    {
                        messageKey: 'crumb-1',
                        label: 'crumbTrail_1',
                        url: '/test',
                        queryParams: {
                            a: 'b'
                        }
                    }
                ],
                parentMenuLabel: 'menu'
            }
    );
    }
}

describe('DotCrumbTrailComponent', () => {
    let fixture: ComponentFixture<DotCrumbTrailComponent>;
    let de: DebugElement;
    let crumbTrailService: MockCrumbTrailService;

    beforeEach(() => {
        crumbTrailService = new MockCrumbTrailService();

        DOTTestBed.configureTestingModule({
            declarations: [DotCrumbTrailComponent],
            imports: [],
            providers: [
                {
                    provide: CrumbTrailService,
                    useValue: crumbTrailService
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotCrumbTrailComponent);
        de = fixture.debugElement;
    });

    it('should have a p-breadcrumb', () => {
        expect(de.query(By.css('p-breadcrumb')) !== null).toBe(true);
    });

    describe('DotCrumbTrailComponent', () => {
        let breadcrumb;

        beforeEach(() => {
            breadcrumb = de.query(By.css('p-breadcrumb'));
        });

        it('should update p-breadcrumb model', () => {
            fixture.detectChanges();

            expect(breadcrumb.componentInstance.model).toEqual([
                {
                    label: 'menu'
                },
                {
                    label: 'crumbTrail_1',
                    url: '/test?a=b'
                }
            ]);
        });
    });
});
