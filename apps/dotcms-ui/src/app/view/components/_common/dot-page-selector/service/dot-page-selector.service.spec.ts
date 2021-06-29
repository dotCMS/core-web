import { DotPageAsset, DotPageSelectorService } from './dot-page-selector.service';
import { mockDotPageSelectorResults } from '../dot-page-selector.component.spec';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { CoreWebService, Site } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';
import {
    DotFolder,
    DotPageSelectorItem
} from '@components/_common/dot-page-selector/models/dot-page-selector.models';

const MAX_RESULTS_SIZE = 20;

const emptyHostQuery = {
    query: {
        query_string: {
            query: `+contenttype:Host -identifier:SYSTEM_HOST +host.hostName:**`
        }
    },
    size: MAX_RESULTS_SIZE
};

const hostQuery = {
    query: {
        query_string: {
            query: `+contenttype:Host -identifier:SYSTEM_HOST +host.hostName:*demo.dotcms.com*`
        }
    }
};

const hostSpecificQuery = {
    query: {
        query_string: {
            query: `+contenttype:Host -identifier:SYSTEM_HOST +host.hostName:demo.dotcms.com`
        }
    }
};

const mockGetSitesResponse = {
    contentlets: [
        {
            hostname: 'demo.dotcms.com',
            type: 'host',
            identifier: 'abc'
        },
        {
            hostname: 'lunik',
            type: 'host',
            identifier: '123'
        }
    ]
};

const expectedSitesMap: DotPageSelectorItem[] = [
    {
        label: `//${mockGetSitesResponse.contentlets[0].hostname}/`,
        payload: mockGetSitesResponse.contentlets[0] as Site
    },
    {
        label: `//${mockGetSitesResponse.contentlets[1].hostname}/`,
        payload: mockGetSitesResponse.contentlets[1] as Site
    }
];

const mockGetFolderResponse = {
    entity: [
        {
            hostname: 'demo.dotcms.com',
            path: '/activities/'
        },
        {
            hostname: 'lunik',
            path: '/images/'
        }
    ]
};

const expectedFolderMap: DotPageSelectorItem[] = [
    {
        label: `//${mockGetFolderResponse.entity[0].hostname}${mockGetFolderResponse.entity[0].path}`,
        payload: mockGetFolderResponse.entity[0] as DotFolder
    },
    {
        label: `//${mockGetFolderResponse.entity[1].hostname}${mockGetFolderResponse.entity[1].path}`,
        payload: mockGetFolderResponse.entity[1] as DotFolder
    }
];

const mockGetPagedResponse = {
    entity: [
        {
            hostname: 'demo.dotcms.com',
            path: '/activities/hiking',
            identifier: 'abc'
        },
        {
            hostname: 'lunik',
            path: '/activities/walk',
            identifier: '123'
        }
    ]
};

const expectedPagesMap: DotPageSelectorItem[] = [
    {
        label: `//${mockGetPagedResponse.entity[0].hostname}${mockGetPagedResponse.entity[0].path}`,
        payload: (mockGetPagedResponse.entity[0] as unknown) as DotPageAsset
    },
    {
        label: `//${mockGetPagedResponse.entity[1].hostname}${mockGetPagedResponse.entity[1].path}`,
        payload: (mockGetPagedResponse.entity[1] as unknown) as DotPageAsset
    }
];

fdescribe('DotPageSelectorService', () => {
    let injector: TestBed;
    let dotPageSelectorService: DotPageSelectorService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotPageSelectorService
            ]
        });
        injector = getTestBed();
        dotPageSelectorService = injector.get(DotPageSelectorService);
        httpMock = injector.get(HttpTestingController);
    });

    it('should get a page by identifier', () => {
        const searchParam = 'fdeb07ff-6fc3-4237-91d9-728109bc621d';
        const query = {
            query: {
                query_string: {
                    query: `+basetype:5 +identifier:*${searchParam}*`
                }
            }
        };

        dotPageSelectorService.getPageById(searchParam).subscribe((res: any) => {
            expect(res).toEqual({
                label: '//demo.dotcms.com/about-us',
                payload: mockDotPageSelectorResults.data[0].payload
            });
        });

        const req = httpMock.expectOne('/api/es/search');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(query);
        req.flush({ contentlets: [mockDotPageSelectorResults.data[0].payload] });
    });

    it('should make page search', () => {
        dotPageSelectorService.getPages('about-us').subscribe((res: DotPageSelectorItem[]) => {
            expect(res).toEqual(expectedPagesMap);
            expect(req.request.method).toBe('GET');
        });

        const req = httpMock.expectOne(
            `v1/page/search?path=about-us&onlyLiveSites=true&live=false`
        );

        req.flush(mockGetPagedResponse);
    });

    it('should make page folder', () => {
        dotPageSelectorService.getFolders('folder').subscribe((res: any) => {
            expect(res).toEqual(expectedFolderMap);
            expect(req.request.body).toBe({ path: 'folder' });
            expect(req.request.method).toBe('POST');
        });

        const req = httpMock.expectOne(`/api/v1/folder/byPath`);

        req.flush(mockGetFolderResponse);
    });

    it('should make a host search', () => {
        dotPageSelectorService.getSites('//demo.dotcms.com').subscribe((res: any) => {
            expect(res).toEqual(expectedSitesMap);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(hostQuery);
        });

        const req = httpMock.expectOne(`/api/es/search`);

        req.flush(mockGetSitesResponse);
    });

    it('should make specific host search', () => {
        dotPageSelectorService.getSites('//demo.dotcms.com', true).subscribe((res: any) => {
            expect(req.request.body).toEqual(hostSpecificQuery);
        });
        const req = httpMock.expectOne(`/api/es/search`);
        req.flush(mockGetSitesResponse);
    });

    it('should make a host search but limit to MAX_RESULTS_SIZE if string is empty', () => {
        dotPageSelectorService.getSites('//').subscribe((res: any) => {
            expect(req.request.body).toEqual(emptyHostQuery);
        });

        const req = httpMock.expectOne(`/api/es/search`);

        req.flush(mockGetSitesResponse);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
