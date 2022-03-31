import { TestBed } from '@angular/core/testing';
import { DotContentTypeService } from '@services/dot-content-type';
import { of, throwError } from 'rxjs';
import { DotContentTypeStore } from '@portlets/shared/dot-content-types-listing/dot-content-type.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { DotCopyContentTypeDialogFormFields } from '@dotcms/dotcms-models';
import { CoreWebService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';
import { HttpErrorResponse } from '@angular/common/http';
import { mockResponseView } from '@tests/response-view.mock';

describe('DotContentTypeComponentStore', () => {
    let store: DotContentTypeStore;
    let dotContentTypeService: DotContentTypeService;
    let dotHttpErrorManagerService: DotHttpErrorManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DotContentTypeService,
                DotContentTypeStore,
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                {
                    provide: DotContentTypeService,
                    useValue: {
                        saveCopyContentType: jasmine.createSpy().and.returnValue(of({}))
                    }
                },
                {
                    provide: Router,
                    useValue: RouterTestingModule
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
        dotContentTypeService = TestBed.inject(DotContentTypeService);
        dotHttpErrorManagerService = TestBed.inject(DotHttpErrorManagerService);
    });

    describe('updaters', () => {
        it('should update isSaving', () => {
            store.isSaving(true);
            store.state$.subscribe((data) => {
                expect(data.isSaving).toEqual(true);
            });
        });
        it('should update assetSelected', () => {
            const contentTypeSelectedId = 'content-type-id';
            store.setAssetSelected(contentTypeSelectedId);
            store.state$.subscribe((data) => {
                expect(data.assetSelected).toEqual(contentTypeSelectedId);
            });
        });
    });

    describe('effects', () => {
        it('should save Content Type Copy values', () => {
            spyOn(store, 'goToEditContentType');
            const setAssetSelectedMock = 'content-type-id';
            store.setAssetSelected(setAssetSelectedMock);

            const formFields: DotCopyContentTypeDialogFormFields = {
                name: 'new-name',
                host: 'host',
                icon: 'icon',
                folder: 'folder',
                variable: 'validVariableName'
            };

            store.saveCopyDialog(formFields);

            expect(store.goToEditContentType).toHaveBeenCalled();
        });

        it('should handler error on update template', (done) => {
            const error = throwError(new HttpErrorResponse(mockResponseView(400)));
            dotContentTypeService.saveCopyContentType = jasmine.createSpy().and.returnValue(error);
            store.saveCopyDialog({
                name: 'new-name',
                host: 'host',
                icon: 'icon',
                folder: 'folder',
                variable: 'validVariableName'
            });

            expect(dotHttpErrorManagerService.handle).toHaveBeenCalledTimes(1);
            store.isSaving$.subscribe((resp) => {
                expect(resp).toBeFalsy();
                done();
            });
        });
    });
});
