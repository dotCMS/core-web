import { TestBed } from '@angular/core/testing';
import { DotConfigurationService } from './dot-configuration.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoreWebService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';

describe('DotConfigurationService', () => {
    let service: DotConfigurationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotConfigurationService
            ]
        });
        service = TestBed.inject(DotConfigurationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        const keys = 'key1,key2';
        expect(service).toBeTruthy();

        service.getKeys(keys).subscribe();
        const req = httpMock.expectOne(`/api/v1/configuration/config?keys=${keys}`);
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    afterEach(() => {
        httpMock.verify();
    });
});
