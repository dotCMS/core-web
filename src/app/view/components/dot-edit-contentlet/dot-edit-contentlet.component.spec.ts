/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DotEditContentletComponent } from './dot-edit-contentlet.component';

describe('DotEditContentletComponent', () => {
    let component: DotEditContentletComponent;
    let fixture: ComponentFixture<DotEditContentletComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotEditContentletComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEditContentletComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
