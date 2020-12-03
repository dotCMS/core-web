import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DotCrudService } from '@services/dot-crud';
import { DotTempFileUploadService } from '@services/dot-temp-file-upload/dot-temp-file-upload.service';
import { DotWorkflowActionsFireService } from '@services/dot-workflow-actions-fire/dot-workflow-actions-fire.service';
import { of } from 'rxjs';

import { DotTemplateThumbnailFieldComponent } from './dot-template-thumbnail-field.component';

fdescribe('DotTemplateThumbnailFieldComponent', () => {
    let component: DotTemplateThumbnailFieldComponent;
    let fixture: ComponentFixture<DotTemplateThumbnailFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DotTemplateThumbnailFieldComponent],
            providers: [
                {
                    provide: DotTempFileUploadService,
                    useValue: {
                        upload: () => of({})
                    }
                },
                {
                    provide: DotWorkflowActionsFireService,
                    useValue: {
                        publishContentletAndWaitForIndex: () => of({})
                    }
                },
                {
                    provide: DotCrudService,
                    useValue: {
                        getDataById: () => of({})
                    }
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DotTemplateThumbnailFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
