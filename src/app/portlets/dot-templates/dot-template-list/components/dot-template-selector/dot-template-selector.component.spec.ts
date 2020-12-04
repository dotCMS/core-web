import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotTemplateSelectorComponent } from './dot-template-selector.component';

describe('DotTemplateSelectorComponent', () => {
    let component: DotTemplateSelectorComponent;
    let fixture: ComponentFixture<DotTemplateSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotTemplateSelectorComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotTemplateSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
