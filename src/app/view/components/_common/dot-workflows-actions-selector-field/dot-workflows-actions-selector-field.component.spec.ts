import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotWorkflowsActionsSelectorFieldComponent } from './dot-workflows-actions-selector-field.component';

describe('DotWorkflowsActionsSelectorFieldComponent', () => {
    let component: DotWorkflowsActionsSelectorFieldComponent;
    let fixture: ComponentFixture<DotWorkflowsActionsSelectorFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DotWorkflowsActionsSelectorFieldComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DotWorkflowsActionsSelectorFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
