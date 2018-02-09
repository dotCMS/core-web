import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditLayoutAdvancedComponent } from './dot-edit-layout-advanced.component';

describe('DotEditLayoutAdvancedComponent', () => {
    let component: DotEditLayoutAdvancedComponent;
    let fixture: ComponentFixture<DotEditLayoutAdvancedComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [DotEditLayoutAdvancedComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditLayoutAdvancedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
