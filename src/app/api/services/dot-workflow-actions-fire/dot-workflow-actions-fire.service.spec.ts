import { DotWorkflowActionsFireService } from './dot-workflow-actions-fire.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreWebService } from 'dotcms-js';
import { CoreWebServiceMock } from 'projects/dotcms-js/src/lib/core/core-web.service.mock';

describe('DotWorkflowActionsFireService', () => {
    let injector: TestBed;
    let dotWorkflowActionsFireService: DotWorkflowActionsFireService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotWorkflowActionsFireService
            ]
        });
        injector = getTestBed();
        dotWorkflowActionsFireService = injector.get(DotWorkflowActionsFireService);
        httpMock = injector.get(HttpTestingController);
    });

    it('should SAVE and return a new contentlet', () => {
        dotWorkflowActionsFireService
            .newContentlet('persona', { name: 'Test' })
            .subscribe((res) => {
                expect(res).toEqual([
                    {
                        name: 'test'
                    }
                ]);
            });

        const req = httpMock.expectOne('v1/workflow/actions/default/fire/NEW');
        expect(req.request.method).toBe('PUT');
        req.flush({
            entity: [
                {
                    name: 'test'
                }
            ]
        });
    });

    it('should PUBLISH and return a new contentlet', () => {
        dotWorkflowActionsFireService
            .publishContentlet('persona', { name: 'Test' })
            .subscribe((res) => {
                expect(res).toEqual([
                    {
                        name: 'test'
                    }
                ]);
            });

        const req = httpMock.expectOne('v1/workflow/actions/default/fire/PUBLISH');
        expect(req.request.method).toBe('PUT');
        req.flush({
            entity: [
                {
                    name: 'test'
                }
            ]
        });
    });

    it('should PUBLISH, wait for index and return a new contentlet', () => {
        dotWorkflowActionsFireService
            .publishContentletAndWaitForIndex('persona', { name: 'Test' })
            .subscribe((res) => {
                expect(res).toEqual([
                    {
                        name: 'test'
                    }
                ]);
            });

        const req = httpMock.expectOne('v1/workflow/actions/default/fire/PUBLISH');
        expect(req.request.method).toBe('PUT');
        req.flush({
            entity: [
                {
                    name: 'test'
                }
            ]
        });
    });

    it('should create and return a new Content', () => {
        const data = { id: '123' };
        dotWorkflowActionsFireService.fireTo('123', 'new', data).subscribe((res: any) => {
            expect(res).toEqual([
                {
                    name: 'test'
                }
            ]);
        });

        const req = httpMock.expectOne('v1/workflow/actions/new/fire?inode=123');
        expect(req.request.method).toBe('PUT');
        req.flush({
            entity: [
                {
                    name: 'test'
                }
            ]
        });
    });

    afterEach(() => {
        httpMock.verify();
    });
});
