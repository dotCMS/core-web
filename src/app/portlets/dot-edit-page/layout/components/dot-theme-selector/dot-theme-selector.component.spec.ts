import { ComponentFixture } from '@angular/core/testing';

import { DotThemeSelectorComponent } from './dot-theme-selector.component';
import { DebugElement } from '@angular/core';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { Observable } from 'rxjs/Observable';
import { DotTheme } from '../../../shared/models/dot-theme.model';
import { By } from '@angular/platform-browser';
import { mockDotThemes } from '../../../../../test/dot-themes.mock';
import { DataGridModule } from 'primeng/primeng';
import { SiteSelectorModule } from '../../../../../view/components/_common/site-selector/site-selector.module';
import { SiteServiceMock } from '../../../../../test/site-service.mock';
import { SiteService } from 'dotcms-js/dotcms-js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorService } from '../../../../../api/services/paginator/paginator.service';

class DotThemesServiceeMock {
    get(): Observable<DotTheme[]> {
        return Observable.of(mockDotThemes);
    }
}

fdescribe('DotThemeSelectorComponent', () => {
    let component: DotThemeSelectorComponent;
    let fixture: ComponentFixture<DotThemeSelectorComponent>;
    let de: DebugElement;
    const messageServiceMock = new MockDotMessageService({
        'editpage.layout.theme.header': 'Header',
        'editpage.layout.theme.search': 'Search',
        'dot.common.apply': 'Apply',
        'dot.common.cancel': 'Cancel'
    });
    const siteServiceMock = new SiteServiceMock();
    let headerButton: HTMLElement;
    let dialog;
    let paginatorService: PaginatorService;
    let dotThemesService: DotThemesService;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotThemeSelectorComponent],
            imports: [DataGridModule, SiteSelectorModule, BrowserAnimationsModule],
            providers: [
                {
                    provide: DotThemesService,
                    useClass: DotThemesServiceeMock
                },
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
                },
                { provide: SiteService, useValue: siteServiceMock },
                PaginatorService
            ]
        });

        fixture = DOTTestBed.createComponent(DotThemeSelectorComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        dialog = de.query(By.css('p-dialog')).componentInstance;
        //  headerButton = de.query(By.css('button')).nativeElement;
        component.value = mockDotThemes[0];
        paginatorService = de.injector.get(PaginatorService);
        dotThemesService = de.injector.get(DotThemesService);
    });

    describe('Dialog', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should be visible on init', () => {
            expect(dialog.visible).toBeTruthy();
        });

        it('should emit close event when click on cancel button', () => {
            const cancelBtn = de.query(By.css('.cancel')).nativeElement;
            spyOn(component.close, 'emit');
            cancelBtn.click();
            expect(component.close.emit).toHaveBeenCalled();
        });

        it('should not be draggable, modal and have dismissable Mask', () => {
            expect(dialog.closable).toBe(true, 'closable');
            expect(dialog.draggable).toBe(false, 'draggable');
            expect(dialog.modal).toBe(true, 'modal');
        });

        it('should call the apply method and emit the selected value', () => {
            const applyBtn = de.query(By.css('.apply')).nativeElement;
            spyOn(component, 'apply').and.callThrough();
            spyOn(component.selected, 'emit');
            debugger;
            component.current = mockDotThemes[1];
            applyBtn.click();
            fixture.detectChanges();

            expect(component.apply).toHaveBeenCalledTimes(1);
            expect(component.selected.emit).toHaveBeenCalledWith(mockDotThemes[1]);
        });
    });



    xit('should set the page size param onInit', () => {
        fixture.detectChanges();
        expect(paginatorService.extraParams.get('per_page')).toBe('8');
    });

    xit('should set the value of the current theme OnInit', () => {
        //component.value = 'test';
        spyOn(dotThemesService, 'get').and.callThrough();
        fixture.detectChanges();

        expect(dotThemesService.get).toHaveBeenCalledWith('test');
    });

    // it('should paginate when the filter change', () => {
    //     const filter = 'filter';
    //
    //     paginatorService.totalRecords = 2;
    //     spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of([]));
    //
    //     const siteService = de.injector.get(SiteService);
    //     spyOn(siteService, 'switchSite$').and.returnValue(Observable.of({}));
    //
    //     fixture.detectChanges();
    //
    //     const searchableDropdownComponent: SearchableDropdownComponent = de.query(By.css('dot-searchable-dropdown')).componentInstance;
    //
    //     searchableDropdownComponent.filterChange.emit(filter);
    //     comp.handleFilterChange(filter);
    //
    //     expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
    //     expect(paginatorService.filter).toEqual(filter);

    xit('should recalculate pagination on string search', () => {});

    xit('should call theme enpoint when site changes', () => {});

    xit('should call theme enpoint on search', () => {});

    xit('should set the selected theme when click the card', () => {});

    xit('should enable the apply button when pick a theme', () => {});

    xit('should keep the apply button disable if the initial theme is selected', () => {});
});
