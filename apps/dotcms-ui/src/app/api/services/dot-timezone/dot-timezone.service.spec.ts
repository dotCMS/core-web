import { mockDotTimeZones } from '../../../test/dot-timezone.mock';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreWebService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from '@tests/core-web.service.mock';
import { DotTimeZone, DotTimeZoneService } from './dot-timezone.service';

describe('DotTimeZoneService', () => {
    let injector: TestBed;
    let dotTimeZoneService: DotTimeZoneService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                DotTimeZoneService
            ]
        });
        injector = getTestBed();
        dotTimeZoneService = injector.inject(DotTimeZoneService);
        httpMock = injector.inject(HttpTestingController);
    });

    it('should get TimeZones ordered alphabetically', () => {
        dotTimeZoneService.get().subscribe((result) => {
            const expectedResult = [...mockDotTimeZones];
            expectedResult.sort((a: DotTimeZone, b: DotTimeZone) => {
                if (a.label < b.label) {
                    return -1;
                }
                if (a.label > b.label) {
                    return 1;
                }
                return 0;
            });
            expect(result).toEqual(expectedResult);
        });

        const req = httpMock.expectOne('v1/appconfiguration');
        expect(req.request.method).toBe('GET');
        req.flush({ entity: { config: { timezones: mockDotTimeZones } } });
    });

    afterEach(() => {
        httpMock.verify();
    });
});
