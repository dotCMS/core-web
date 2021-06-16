import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditPageContentTypeNavComponent } from './dot-edit-page-content-type-nav.component';

describe('DotEditPageSubNavComponent', () => {
    let component: DotEditPageContentTypeNavComponent;
    let fixture: ComponentFixture<DotEditPageContentTypeNavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotEditPageContentTypeNavComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditPageContentTypeNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
