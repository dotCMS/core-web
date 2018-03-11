import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotLayoutDesignerComponent } from './dot-layout-designer.component';

describe('DotLayoutDesignerComponent', () => {
    let component: DotLayoutDesignerComponent;
    let fixture: ComponentFixture<DotLayoutDesignerComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [DotLayoutDesignerComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DotLayoutDesignerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
