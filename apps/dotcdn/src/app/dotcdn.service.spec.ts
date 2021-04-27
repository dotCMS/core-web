import { TestBed } from '@angular/core/testing';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DotCDNService } from './dotcdn.service';
import { SiteServiceMock, CoreWebServiceMock } from '@dotcms/dotcms-js';

describe('DotcdnService', () => {
    let service: DotCDNService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: CoreWebService, useClass: CoreWebServiceMock },
                { provide: SiteService, useClass: SiteServiceMock }
            ]
        });
        service = TestBed.inject(DotCDNService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return an object with stats', () => {
        pending();
    });
});
