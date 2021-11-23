import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreWebService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';
import { DotPaginatorESContentService } from './dot-paginator-es-content.service';

describe('DotPaginatorESContentService', () => {
    let injector: TestBed;
    let dotPaginatorESContentService: DotPaginatorESContentService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotPaginatorESContentService
            ]
        });
        injector = getTestBed();
        dotPaginatorESContentService = injector.get(DotPaginatorESContentService);
        httpMock = injector.inject(HttpTestingController);
    });

    it('should get Blogs with default values', () => {
        dotPaginatorESContentService.get({ query: '+contentType: blog' }).subscribe((res) => {
            expect(res).toEqual([]);
        });

        const req = httpMock.expectOne('/api/content/_search');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBe(
            '{"query":"  +deleted : false   +working : true   +contentType :  blog   +title : *  ","sort":"modDate ASC","limit":40,"offset":0}'
        );
        req.flush({ entity: { jsonObjectView: { contentlets: [] } } });
    });

    it('should get Blogs with custom values', () => {
        dotPaginatorESContentService
            .get({
                itemsPerPage: 5,
                filter: 'test',
                lang: '2',
                offset: 10,
                sortField: 'name',
                sortOrder: 'ASC',
                query: '+contentType: blog'
            })
            .subscribe((res) => {
                expect(res).toEqual([]);
            });

        const req = httpMock.expectOne('/api/content/_search');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBe(
            '{"query":"  +deleted : false   +working : true   +contentType :  blog   +languageId : 2   +title : test*  ","sort":"name ASC","limit":5,"offset":10}'
        );
        req.flush({ entity: { jsonObjectView: { contentlets: [] } } });
    });

    afterEach(() => {
        httpMock.verify();
    });
});
