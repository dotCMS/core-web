import { TestBed } from '@angular/core/testing';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from './coreweb.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DotCDNService } from './dotcdn.service';
import { SiteServiceMock } from './siteservice.mock-temp';
import { of } from 'rxjs';
import { DotCDNStats } from './app.interface';

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
        // service.currentSite$.next('hello')
        // service.requestStats('30').subscribe((value) => {
        //     expect(value).toBeFalsy();
        //     done();
        // });
    });
});
