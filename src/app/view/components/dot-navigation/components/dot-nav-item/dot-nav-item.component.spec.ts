/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotNavItemComponent } from './dot-nav-item.component';

describe('DotNavItemComponent', () => {
    let component: DotNavItemComponent;
    let fixture: ComponentFixture<DotNavItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotNavItemComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotNavItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
