import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEmptyStateComponent } from './dot-empty-state.component';

describe('DotEmptyStateComponent', () => {
    let component: DotEmptyStateComponent;
    let fixture: ComponentFixture<DotEmptyStateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotEmptyStateComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotEmptyStateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
