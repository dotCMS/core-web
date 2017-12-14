import { ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';
import { SiteSelectorComponent } from './site-selector.component';
import { By } from '@angular/platform-browser';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { SearchableDropDownModule } from '../searchable-dropdown/searchable-dropdown.module';
import {
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule
} from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../../../api/services/messages-service';
import { MockMessageService } from '../../../../test/message-service.mock';
import { SiteServiceMock } from '../../../../test/site-service.mock';
import { SiteService, DotcmsConfig } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { SearchableDropdownComponent } from '../searchable-dropdown/component/searchable-dropdown.component';
import { fakeAsync, tick } from '@angular/core/testing';
import { PaginatorService } from '../../../../api/services/paginator';
import { IframeOverlayService } from '../iframe/service/iframe-overlay.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SiteSelectorComponent', () => {
    let comp: SiteSelectorComponent;
    let fixture: ComponentFixture<SiteSelectorComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(
        async(() => {
            const messageServiceMock = new MockMessageService({
                search: 'Search'
            });

            const siteServiceMock = new SiteServiceMock();

            DOTTestBed.configureTestingModule({
                declarations: [SiteSelectorComponent],
                imports: [SearchableDropDownModule, BrowserAnimationsModule],
                providers: [
                    { provide: MessageService, useValue: messageServiceMock },
                    { provide: SiteService, useValue: siteServiceMock },
                    IframeOverlayService,
                    PaginatorService
                ]
            });

            fixture = DOTTestBed.createComponent(SiteSelectorComponent);
            comp = fixture.componentInstance;
            de = fixture.debugElement;
            el = de.nativeElement;
        })
    );

    it('should set extra params to paginator service', () => {
        comp.archive = false;

        fixture.detectChanges();

        const paginatorService: PaginatorService = de.injector.get(PaginatorService);


        expect(paginatorService.extraParams.get('archive')).toBe('false');
        expect(paginatorService.extraParams.get('system')).toBe(null);
    });

    it('should set extra params to paginator service (system default) and archived true', () => {
        comp.archive = true;

        fixture.detectChanges();

        const paginatorService: PaginatorService = de.injector.get(PaginatorService);

        expect(paginatorService.extraParams.get('archive')).toBe('true');
        expect(paginatorService.extraParams.get('system')).toBe(null);
    });

    it('should call getSitesList', () => {
        const site1 = {
            identifier: 1,
            name: 'Site 1'
        };

        const site2 = {
            identifier: 2,
            name: 'Site 2'
        };

        const siteService = de.injector.get(SiteService);
        spyOn(siteService, 'switchSite$').and.returnValue(Observable.of(site1));

        const paginatorService: PaginatorService = de.injector.get(PaginatorService);
        spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of([site1, site2]));

        fixture.detectChanges();

        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
    });

    it('should call refresh if a event happen', async(() => {
        const site1 = {
            identifier: 1,
            name: 'Site 1'
        };

        const site2 = {
            identifier: 2,
            name: 'Site 2'
        };

        const siteService = de.injector.get(SiteService);
        const spy = spyOn(siteService, 'refreshSites$').and.returnValue(
            Observable.of([site1, site2])
        );

        fixture.detectChanges();

        expect(spy.calls.any()).toEqual(false);
    }));

    it('should change Page', fakeAsync(() => {
        const filter = 'filter';
        const page = 1;

        const paginatorService: PaginatorService = de.injector.get(PaginatorService);
        paginatorService.totalRecords = 2;
        spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of([]));

        const siteService = de.injector.get(SiteService);
        spyOn(siteService, 'switchSite$').and.returnValue(Observable.of({}));

        fixture.detectChanges();

        const searchableDropdownComponent: SearchableDropdownComponent = de.query(
            By.css('searchable-dropdown')
        ).componentInstance;

        searchableDropdownComponent.pageChange.emit({
            filter: filter,
            first: 10,
            page: page,
            pageCount: 10,
            rows: 0
        });

        tick();
        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(10);
    }));

    it('should paginate when the filter change', fakeAsync(() => {
        const filter = 'filter';
        const first = 2;

        const paginatorService: PaginatorService = de.injector.get(PaginatorService);
        paginatorService.totalRecords = 2;
        spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of([]));

        const siteService = de.injector.get(SiteService);
        spyOn(siteService, 'switchSite$').and.returnValue(Observable.of({}));

        fixture.detectChanges();

        const searchableDropdownComponent: SearchableDropdownComponent = de.query(
            By.css('searchable-dropdown')
        ).componentInstance;

        searchableDropdownComponent.filterChange.emit(filter);
        comp.handleFilterChange(filter);

        tick();
        expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
        expect(paginatorService.filter).toEqual(filter);
    }));

    it('should be assign to filter if empty', fakeAsync(() => {
        const paginatorService: PaginatorService = de.injector.get(PaginatorService);
        paginatorService.filter = 'filter';
        paginatorService.totalRecords = 2;
        spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of([]));

        fixture.detectChanges();

        const searchableDropdownComponent: SearchableDropdownComponent = de.query(
            By.css('searchable-dropdown')
        ).componentInstance;

        searchableDropdownComponent.filterChange.emit('');

        tick();
        expect(paginatorService.filter).toEqual('');
    }));
});
