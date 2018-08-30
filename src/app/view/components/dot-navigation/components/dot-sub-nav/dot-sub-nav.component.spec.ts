/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotSubNavComponent } from './dot-sub-nav.component';

describe('DotSubNavComponent', () => {
    let component: DotSubNavComponent;
    let fixture: ComponentFixture<DotSubNavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotSubNavComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotSubNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
