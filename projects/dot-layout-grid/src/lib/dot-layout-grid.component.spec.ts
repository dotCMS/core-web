import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotLayoutGridComponent } from './dot-layout-grid.component';

describe('DotLayoutGridComponent', () => {
    let component: DotLayoutGridComponent;
    let fixture: ComponentFixture<DotLayoutGridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotLayoutGridComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotLayoutGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
