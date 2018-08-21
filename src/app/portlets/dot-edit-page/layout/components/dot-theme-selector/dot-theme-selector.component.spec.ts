import { ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DotThemeSelectorComponent } from './dot-theme-selector.component';
import { DebugElement } from '@angular/core';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { DOTTestBed } from '../../../../../test/dot-test-bed';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import { MockDotMessageService } from '../../../../../test/dot-message-service.mock';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { mockDotThemes } from '../../../../../test/dot-themes.mock';
import { DataGridModule } from 'primeng/primeng';
import { SiteSelectorModule } from '../../../../../view/components/_common/site-selector/site-selector.module';
import { mockSites, SiteServiceMock } from '../../../../../test/site-service.mock';
import { SiteService } from 'dotcms-js/dotcms-js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorService } from '../../../../../api/services/paginator/paginator.service';
import { DotThemesServiceMock } from '../../../../../test/dot-themes-service.mock';
import { DotIconModule } from '../../../../../view/components/_common/dot-icon/dot-icon.module';
import { DotDialogModule } from '../../../../../view/components/dot-dialog/dot-dialog.module';
import { DotDialogComponent } from '../../../../../view/components/dot-dialog/dot-dialog.component';

describe('DotThemeSelectorComponent', () => {
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
    let dialog;
    let dotDialog: DotDialogComponent;
    let paginatorService: PaginatorService;
    let dotThemesService: DotThemesService;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotThemeSelectorComponent],
            imports: [DataGridModule, SiteSelectorModule, BrowserAnimationsModule, DotDialogModule, DotIconModule],
            providers: [
                {
                    provide: DotThemesService,
                    useClass: DotThemesServiceMock
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
        dotDialog = de.query(By.css('dot-dialog')).componentInstance;
        component.value = Object.assign({}, mockDotThemes[0]);
        paginatorService = de.injector.get(PaginatorService);
        dotThemesService = de.injector.get(DotThemesService);
    });

    describe('Dialog', () => {
        beforeEach(() => {
            component.dotDialog.reRecenter = jasmine.createSpy('reCenter');
            fixture.detectChanges();
        });

        it('should be visible on init and re-centered', () => {
            expect(dialog.visible).toBeTruthy();
            expect(dotDialog.reRecenter).toHaveBeenCalled();
        });

        it('should not be draggable, modal and have dismissable Mask', () => {
            expect(dialog.closable).toBe(false, 'closable');
            expect(dialog.draggable).toBe(false, 'draggable');
            expect(dialog.modal).toBe(true, 'modal');
        });

        it('should have defined Dialog actions for Apply/Cancel buttons', () => {
            const applyDialogActionTpl = {
                label: messageServiceMock.get('dot.common.apply'),
                disabled: true,
                action: () => {
                    this.apply();
                }
            };
            const closeDialogActionTpl = {
                label: messageServiceMock.get('dot.common.cancel'),
                action: (dialogElem) => {
                    dialogElem.closeDialog();
                }
            };
            expect(JSON.stringify(component.applyDialogAction)).toBe(JSON.stringify(applyDialogActionTpl));
            expect(JSON.stringify(component.closeDialogAction)).toBe(JSON.stringify(closeDialogActionTpl));
        });
    });

    describe('On Init', () => {
        beforeEach(() => {});

        it('should set url, the page size and hostid for the pagination service', () => {
            spyOn(paginatorService, 'setExtraParams');
            fixture.detectChanges();
            expect(paginatorService.paginationPerPage).toBe(8);
            expect(paginatorService.url).toBe('v1/themes');
            expect(paginatorService.setExtraParams).toHaveBeenCalledWith('hostId', '123-xyz-567-xxl');
        });

        it('should set the current theme variable based on the Input value', () => {
            const value = Object.assign({}, mockDotThemes[0]);
            component.value = value;
            fixture.detectChanges();
            expect(component.current).toBe(value);
        });

        it('should call pagination service with offset of 0 ', () => {
            spyOn(component, 'paginate').and.callThrough();
            spyOn(paginatorService, 'getWithOffset');
            fixture.detectChanges();

            expect(component.paginate).toHaveBeenCalledTimes(1);
            expect(paginatorService.getWithOffset).toHaveBeenCalledWith(0);
        });

        it('should disable the apply button', () => {
            fixture.detectChanges();
            expect(component.applyDialogAction.disabled).toBe(true);
        });

        it('should show theme image when available', () => {
            spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of(mockDotThemes));
            component.siteChange(mockSites[0]);
            fixture.detectChanges();
            const themeImage: DebugElement = fixture.debugElement.query(By.css('.dot-theme-iteme__image'));

            expect(themeImage).not.toBeNull();
        });
    });

    describe('User interaction', () => {
        beforeEach(() => {
            spyOn(paginatorService, 'getWithOffset').and.returnValue(Observable.of(mockDotThemes));
        });

        it('should set pagination, call endpoint and clear search field on site change ', () => {
            spyOn(component, 'paginate');
            component.siteChange(mockSites[0]);
            fixture.detectChanges();

            expect(component.searchInput.nativeElement.value).toBe('');
            expect(paginatorService.extraParams.get('hostId')).toBe(mockSites[0].identifier);
            expect(paginatorService.extraParams.get('searchParam')).toBe('');
            expect(component.paginate).toHaveBeenCalledWith({ first: 0 });
        });

        it('should set the current value when the user click a specific theme', () => {
            spyOn(component, 'selectTheme').and.callThrough();
            component.paginate({ first: 0 });
            fixture.detectChanges();
            const themes: DebugElement[] = fixture.debugElement.queryAll(By.css('.dot-theme-item'));
            themes[1].nativeElement.click();

            expect(component.current).toBe(mockDotThemes[1]);
            expect(component.selectTheme).toHaveBeenCalled();
        });

        it('should active the apply button and set active when user select a different theme than the one in value', () => {
            component.paginate({ first: 0 });
            fixture.detectChanges();
            const themes: DebugElement[] = fixture.debugElement.queryAll(By.css('.dot-theme-item'));
            const applyButton: DebugElement = fixture.debugElement.query(By.css('.apply'));
            themes[1].nativeElement.click();
            fixture.detectChanges();

            expect(component.applyDialogAction.disabled).toBe(false);
        });

        it('should call theme enpoint on search', fakeAsync(() => {
            spyOn(component, 'paginate');
            fixture.detectChanges();
            component.searchInput.nativeElement.value = 'test';
            component.searchInput.nativeElement.dispatchEvent(new Event('keyup'));
            tick(550);

            expect(paginatorService.extraParams.get('searchParam')).toBe('test');
            expect(component.paginate).toHaveBeenCalled();
        }));
    });
});
