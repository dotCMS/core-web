import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotThemeSelectorDropdownComponent } from './dot-theme-selector-dropdown.component';

describe('DotThemeSelectorDropdownComponent', () => {
    let component: DotThemeSelectorDropdownComponent;
    let fixture: ComponentFixture<DotThemeSelectorDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotThemeSelectorDropdownComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotThemeSelectorDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });
});
