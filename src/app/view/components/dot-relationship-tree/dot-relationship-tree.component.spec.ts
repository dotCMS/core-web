import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotRelationshipTreeComponent } from './dot-relationship-tree.component';

describe('DotRelationshipTreeComponent', () => {
    let component: DotRelationshipTreeComponent;
    let fixture: ComponentFixture<DotRelationshipTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotRelationshipTreeComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotRelationshipTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
