import { TestBed } from '@angular/core/testing';
import { DotContentTypeService } from '@services/dot-content-type';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DotCMSBaseTypesContentTypes } from '@dotcms/dotcms-models';
import {
    DotCMSAssetDialogCopyFields,
    DotContentTypeStore
} from '@portlets/shared/dot-content-types-listing/dot-content-type.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

@Injectable()
class MockDotContentTypeService {}

const assetSelectedMock: DotCMSAssetDialogCopyFields = {
    title: 'title of the dialog',
    assetIdentifier: '123456',
    baseType: DotCMSBaseTypesContentTypes.FORM,
    data: {
        icon: 'icon',
        host: 'host'
    }
};

describe('DotContentTypeComponentStore', () => {
    let store: DotContentTypeStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DotContentTypeStore,
                {
                    provide: Router,
                    useValue: RouterTestingModule
                },
                {
                    provide: DotContentTypeService,
                    useValue: MockDotContentTypeService
                },
                {
                    provide: DotHttpErrorManagerService,
                    useValue: {
                        handle: jasmine.createSpy().and.returnValue(of({}))
                    }
                }
            ]
        });
        store = TestBed.inject(DotContentTypeStore);
    });

    // UPDATERS
    it('should update showCloneDialog', () => {
        store.showCloneDialog(assetSelectedMock);

        store.state$.subscribe((data) => {
            expect(data.isSaving).toEqual(false);
            expect(data.isVisibleCloneDialog).toEqual(true);
            expect(data.assetSelected).toEqual(assetSelectedMock);
        });
    });

    it('should update hideCloneDialog', () => {
        store.hideCloneDialog();
        store.state$.subscribe((data) => {
            expect(data.isVisibleCloneDialog).toEqual(false);
            expect(data.assetSelected).toEqual(null);
        });
    });

    it('should update isSaving', () => {
        store.isSaving(true);
        store.state$.subscribe((data) => {
            expect(data.isSaving).toEqual(true);
        });
    });
});
