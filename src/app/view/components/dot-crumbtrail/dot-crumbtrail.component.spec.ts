/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotCrumbtrailComponent } from './dot-crumbtrail.component';

describe('DotCrumbtrailComponent', () => {
    let component: DotCrumbtrailComponent;
    let fixture: ComponentFixture<DotCrumbtrailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotCrumbtrailComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotCrumbtrailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
