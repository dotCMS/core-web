import { TestBed } from '@angular/core/testing';
import { DotConfigurationService } from './dot-configuration.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoreWebService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';

const fakeResponse = {
    key1: 'data',
    'list:key1': [1, 2]
};

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

    it('should get key', () => {
        const key = 'key1';
        expect(service).toBeTruthy();

        service.getKey<string>(key).subscribe((response) => {
            expect(response).toEqual(fakeResponse.key1);
        });
        const req = httpMock.expectOne(`/api/v1/configuration/config?keys=${key}`);
        expect(req.request.method).toBe('GET');
        req.flush(fakeResponse);
    });

    it('should get ky as a list', () => {
        const key = 'key1';
        expect(service).toBeTruthy();

        service.getKeyAsList<number[]>(key).subscribe((response) => {
            expect(response).toEqual(fakeResponse['list:key1']);
        });
        const req = httpMock.expectOne(`/api/v1/configuration/config?keys=list:${key}`);
        expect(req.request.method).toBe('GET');
        req.flush(fakeResponse);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
