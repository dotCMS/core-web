/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DotCrumbtrailComponent } from './dot-crumbtrail.component';
import { BreadcrumbModule } from 'primeng/primeng';
import { DotCrumbtrailService, Crumb } from './service/dot-crumbtrail.service';
import { Injectable, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
class MockDotCrumbtrailService {

    private crumbTrail: Subject<Crumb[]> = new Subject();

    get crumbTrail$(): Observable<Crumb[]> {
        return this.crumbTrail.asObservable();
    }

    trigger(crumbs: Crumb[]): void {
        this.crumbTrail.next(crumbs);
    }
}

describe('DotCrumbtrailComponent', () => {
    let component: DotCrumbtrailComponent;
    let fixture: ComponentFixture<DotCrumbtrailComponent>;
    let de: DebugElement;
    const dotCrumbtrailService: MockDotCrumbtrailService = new MockDotCrumbtrailService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotCrumbtrailComponent],
            imports: [BreadcrumbModule],
            providers: [
                {
                    provide: DotCrumbtrailService,
                    useValue: dotCrumbtrailService
                },
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotCrumbtrailComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should has a p-breadcrumb', () => {
        const pBreadCrumb: DebugElement = de.query(By.css('p-breadcrumb'));
        expect(pBreadCrumb).not.toBeNull();
    });

    it('should listen crumbTrail event from service', () => {
        const crumbs = [
            {
                label: 'label',
                url: 'url'
            }
        ];

        dotCrumbtrailService.trigger(crumbs);

        const pBreadCrumb: DebugElement = de.query(By.css('p-breadcrumb'));

        fixture.detectChanges();
        expect(pBreadCrumb.componentInstance.model).toBe(crumbs);
    });
});
