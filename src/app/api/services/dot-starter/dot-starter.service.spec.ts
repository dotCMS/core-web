import { getTestBed, TestBed } from '@angular/core/testing';

import { DotStarterService } from './dot-starter.service';
import { CoreWebService } from 'dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DotStarterService', () => {
    let service: DotStarterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotStarterService
            ]
        });
        service = TestBed.inject(DotStarterService);
        httpMock = getTestBed().get(HttpTestingController);
    });

    it('should call the API to hide the portlet', () => {
        const url = 'api/v1/toolgroups/gettingstarted/_removefromcurrentuser';
        service.hide().subscribe();

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('PUT');
    });

    it('should call the API to show the portlet', () => {
        const url = 'api/v1/toolgroups/gettingstarted/_addtocurrentuser';
        service.show().subscribe();

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('PUT');
    });
});
