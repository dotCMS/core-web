import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotTemplatesComponent } from './dot-templates.component';

describe('DotTemplatesComponent', () => {
    let component: DotTemplatesComponent;
    let fixture: ComponentFixture<DotTemplatesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotTemplatesComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotTemplatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
