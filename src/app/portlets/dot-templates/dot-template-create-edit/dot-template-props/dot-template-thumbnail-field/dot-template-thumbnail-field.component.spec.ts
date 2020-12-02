import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotTemplateThumbnailFieldComponent } from './dot-template-thumbnail-field.component';

describe('DotTemplateThumbnailFieldComponent', () => {
    let component: DotTemplateThumbnailFieldComponent;
    let fixture: ComponentFixture<DotTemplateThumbnailFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotTemplateThumbnailFieldComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotTemplateThumbnailFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
