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

class DotThemesServiceeMock {
    get(): Observable<DotTheme[]> {
        return Observable.of(mockDotThemes);
    }
}

fdescribe('DotThemeSelectorComponent', () => {
    let component: DotThemeSelectorComponent;
    let fixture: ComponentFixture<DotThemeSelectorComponent>;
    let de: DebugElement;
    // const defaultPersona: DotPersona = { name: 'Default Persona', identifier: '0' };
    const messageServiceMock = new MockDotMessageService({
        'editpage.layout.theme.header': 'Header',
        'editpage.layout.theme.search': 'Search',
        'dot.common.apply': 'Apply',
        'dot.common.cancel': 'Cancel'
    });
    const siteServiceMock = new SiteServiceMock();
    let headerButton: HTMLElement;
    let dialog;

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
                { provide: SiteService, useValue: siteServiceMock }
            ]
        });

        fixture = DOTTestBed.createComponent(DotThemeSelectorComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        dialog = de.query(By.css('p-dialog')).componentInstance;
        headerButton = de.query(By.css('button')).nativeElement;
    });

    describe('Dialog', () => {
        beforeEach(() => {});

        it('should show when click the button in the toolbar', () => {
            headerButton.click();
            fixture.detectChanges();
            expect(dialog.visible).toBeTruthy();
        });

        it('should close on cancel button', () => {
            headerButton.click();
            fixture.detectChanges();
            const cancelBtn = de.query(By.css('.cancel')).nativeElement;
            cancelBtn.click();
            fixture.detectChanges();
            expect(dialog.visible).toBeFalsy();
        });

        it('should not be draggable, modal and have dismissable Mask', () => {
            fixture.detectChanges();
            expect(dialog.closable).toBe(true, 'closable');
            expect(dialog.draggable).toBe(false, 'draggable');
            expect(dialog.modal).toBe(true, 'modal');
        });
    });

    it('should call the apply method and emit the selected value', () => {
        headerButton.click();
        fixture.detectChanges();
        const applyBtn = de.query(By.css('.apply')).nativeElement;

        spyOn(component, 'apply').and.callThrough();
        spyOn(component.selected, 'emit');
        component.current = mockDotThemes[0];
        applyBtn.click();
        fixture.detectChanges();

        expect(component.apply).toHaveBeenCalledTimes(1);
        expect(component.selected.emit).toHaveBeenCalledWith(mockDotThemes[0]);
    });


    xit('should call theme enpoint when site changes', () => {});

    xit('should call theme enpoint on search', () => {});

    xit('should set the selected theme when click the card', () => {});

    xit('should enable the apply button when pick a theme', () => {});

    xit('should keep the apply button disable if the initial theme is selected', () => {});
});
