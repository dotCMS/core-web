import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotBulkInformationComponent } from './dot-bulk-information.component';

describe('DotBulkInformationComponent', () => {
    let component: DotBulkInformationComponent;
    let fixture: ComponentFixture<DotBulkInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotBulkInformationComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotBulkInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
