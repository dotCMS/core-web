import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotPageSelectorComponent } from './dot-page-selector.component';

describe('DotPageSelectorComponent', () => {
    let component: DotPageSelectorComponent;
    let fixture: ComponentFixture<DotPageSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotPageSelectorComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotPageSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
