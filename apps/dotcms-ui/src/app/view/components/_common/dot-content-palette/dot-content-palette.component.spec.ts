import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotContentPaletteComponent } from './dot-content-palette.component';

describe('DotEditPageSubNavComponent', () => {
    let component: DotContentPaletteComponent;
    let fixture: ComponentFixture<DotContentPaletteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotContentPaletteComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotContentPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
