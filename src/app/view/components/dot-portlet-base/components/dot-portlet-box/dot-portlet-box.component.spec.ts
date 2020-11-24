import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotPortletBoxComponent } from './dot-portlet-box.component';

describe('DotPortletBoxComponent', () => {
    let component: DotPortletBoxComponent;
    let fixture: ComponentFixture<DotPortletBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotPortletBoxComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotPortletBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
