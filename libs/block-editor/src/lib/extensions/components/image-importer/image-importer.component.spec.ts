import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageImporterComponent } from './image-importer.component';

describe('ImageImporterComponent', () => {
    let component: ImageImporterComponent;
    let fixture: ComponentFixture<ImageImporterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImageImporterComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageImporterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
