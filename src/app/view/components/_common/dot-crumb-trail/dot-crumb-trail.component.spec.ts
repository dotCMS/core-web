
import { DebugElement, Injectable } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DotCrumbTrailComponent } from './dot-crumb-trail.component';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { CrumbTrailService } from './services/dot-crumb-trail.service';

/*@Injectable()
class MockCrumbTrailService {
    get crumbTrails():  Observable<CrumbTrail[]> {
        return Observable.of([
            {
                label: 'crumbTrail_1',
                url: '/test'
            }
        ]);
    }
}*/

describe('DotCrumbTrailComponent', () => {
    /*let fixture: ComponentFixture<DotCrumbTrailComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotCrumbTrailComponent],
            imports: [],
            providers: [
                {
                    provide: CrumbTrailService,
                    useClass: MockCrumbTrailService
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotCrumbTrailComponent);
        de = fixture.debugElement;
    });

    it('should have a p-breadcrumb', () => {
        expect(de.query(By.css('p-breadcrumb')) !== null).toBe(true);
    });

    it('should update p-breadcrumb model', () => {
        fixture.detectChanges();

        const breadcrumb = de.query(By.css('p-breadcrumb'));

        expect(breadcrumb.componentInstance.model).toEqual([
            {
                label: 'crumbTrail_1',
                url: '/test'
            }
        ]);
    });*/
});
