import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';
import { SiteSelectorComponent } from './dot-site-selector.component';
import { By } from '@angular/platform-browser';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { SearchableDropDownModule } from '../_common/searchable-dropdown/searchable-dropdown.module';
import { OverlayPanelModule, ButtonModule, InputTextModule, PaginatorModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../../api/services/messages-service';
import { MockMessageService } from '../../../test/message-service.mock';
import { SiteServiceMock } from '../../../test/site-service.mock';
import { IframeOverlayService } from '../../../api/services/iframe-overlay-service';
import { SiteService } from '../../../api/services/site-service';
import { Observable } from 'rxjs/Observable';
import { DotcmsConfig } from '../../../api/services/system/dotcms-config';
import { SearchableDropdownComponent } from '../_common/searchable-dropdown/component/searchable-dropdown.component';
import { fakeAsync, tick } from '@angular/core/testing';
import { PaginatorService } from '../../../api/services/paginator';

describe('Site Selector Component', () => {

  let comp: SiteSelectorComponent;
  let fixture: ComponentFixture<SiteSelectorComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {

    let siteServiceMock = new SiteServiceMock();

    DOTTestBed.configureTestingModule({
        declarations: [ SiteSelectorComponent ],
        imports: [
            SearchableDropDownModule
        ],
        providers: [
          {provide: SiteService, useValue: siteServiceMock},
          IframeOverlayService, PaginatorService
        ]
    });

    fixture = DOTTestBed.createComponent(SiteSelectorComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  }));

  it('Should call paginateSites', () => {
    let paginatorService = de.injector.get(PaginatorService);
    spyOn(paginatorService, 'getPage').and.returnValue(Observable.of([]));

    let siteService = de.injector.get(SiteService);
    spyOn(siteService, 'switchSite$').and.returnValue(Observable.of({}));

    comp.ngOnInit();

    expect(paginatorService.getPage).toHaveBeenCalledWith(1);

  });

  it('Should change Page', fakeAsync(() => {

    let filter = 'filter';
    let page = 1;

    let paginatorService = de.injector.get(PaginatorService);
    paginatorService.totalRecords = 2;
    spyOn(paginatorService, 'getPage').and.returnValue(Observable.of([]));

    let siteService = de.injector.get(SiteService);
    spyOn(siteService, 'switchSite$').and.returnValue(Observable.of({}));

    comp.ngOnInit();

    fixture.detectChanges();
    let searchableDropdownComponent: SearchableDropdownComponent = de.query(By.css('searchable-dropdown')).componentInstance;

    searchableDropdownComponent.pageChange.emit({
      filter: filter,
      first: 0,
      page: 2,
      pageCount: 0,
      rows: 0
    });

    tick();
    expect(paginatorService.getPage).toHaveBeenCalledWith(1);
    expect(paginatorService.getPage).toHaveBeenCalledWith(2);
  }));

  it('Should paginate when the filter change', fakeAsync(() => {

    let filter = 'filter';
    let first = 2;

    let paginatorService = de.injector.get(PaginatorService);
    paginatorService.totalRecords = 2;
    spyOn(paginatorService, 'getPage').and.returnValue(Observable.of([]));

    let siteService = de.injector.get(SiteService);
    spyOn(siteService, 'switchSite$').and.returnValue(Observable.of({}));

    comp.ngOnInit();

    fixture.detectChanges();
    let searchableDropdownComponent: SearchableDropdownComponent = de.query(By.css('searchable-dropdown')).componentInstance;

    searchableDropdownComponent.filterChange.emit(filter);
    comp.handleFilterChange(filter);

    tick();
    expect(paginatorService.getPage).toHaveBeenCalledWith(1);
    expect(paginatorService.filter).toEqual(filter);
  }));
});