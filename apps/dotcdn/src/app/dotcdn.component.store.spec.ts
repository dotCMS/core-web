import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreWebService, SiteService } from '@dotcms/dotcms-js';
import { CoreWebServiceMock } from './coreweb.service.mock-temp';
import { DotCDNStore } from './dotcdn.component.store';
import { DotCDNService } from './dotcdn.service';
import { SiteServiceMock } from './siteservice.mock-temp';

fdescribe('DotCDNComponentStore', () => {

      let service: DotCDNStore;

      beforeEach(() => {
          TestBed.configureTestingModule({
              imports: [HttpClientTestingModule],
              providers: [
                  DotCDNService,
                  DotCDNStore,
                  { provide: CoreWebService, useClass: CoreWebServiceMock },
                  { provide: SiteService, useClass: SiteServiceMock }
              ]
          });
          service = TestBed.inject(DotCDNStore);
      });

    describe('addMovie reducer', () => {
        it('should...', () => {
            pending()
        });
    });

});
