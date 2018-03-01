import { ComponentFixture } from '@angular/core/testing';

import { DotEditContentViewAsToolbarComponent } from './dot-edit-content-view-as-toolbar.component';
import { DotDevicesService } from '../../../../api/services/dot-devices/dot-devices.service';
import { DotLanguagesService } from '../../../../api/services/dot-languages/dot-languages.service';
import { DotPersonasService } from '../../../../api/services/dot-personas/dot-personas.service';
import { DotViewAsService } from '../../../../api/services/dot-view-as/dot-view-as.service';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotEditPageViewAs } from '../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { By } from '@angular/platform-browser';
import { DotDevicesServiceMock } from '../../../../test/dot-device-service.mock';
import { DotLanguagesServiceMock } from '../../../../test/dot-languages-service.mock';
import { DotPersonasServiceMock } from '../../../../test/dot-personas-service.mock';

describe('DotEditContentViewAsToolbarComponent', () => {
    let component: DotEditContentViewAsToolbarComponent;
    let fixture: ComponentFixture<DotEditContentViewAsToolbarComponent>;
    let de: DebugElement;
    let dotViewAsService: DotViewAsService;

    const pageViewAsPreLoadedValue: DotEditPageViewAs = {
        personaId: '2',
        languageId: 'es',
        device: { id: '1', label: 'iPhone', width: '375px', height: '667px' }
    };
    const pageViewAsInitialValue: DotEditPageViewAs = {
        personaId: '1c56ba62-1f41-4b81-bd62-b6eacff3ad23',
        languageId: 'en',
        device: { id: '0', label: 'Desktop', width: '100%', height: '100%' }
    };

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotEditContentViewAsToolbarComponent],
            imports: [BrowserAnimationsModule],
            providers: [
                DotViewAsService,
                {
                    provide: DotDevicesService,
                    useClass: DotDevicesServiceMock
                },
                {
                    provide: DotPersonasService,
                    useClass: DotPersonasServiceMock
                },
                {
                    provide: DotLanguagesService,
                    useClass: DotLanguagesServiceMock
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotEditContentViewAsToolbarComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        dotViewAsService = fixture.debugElement.injector.get(DotViewAsService);
    });

    it('should set the initial values for the dropdowns & emit the Device', () => {
        spyOn(component.changeDevice, 'emit');
        fixture.detectChanges();

        expect(component.viewAsConfig).toEqual(pageViewAsInitialValue);
        expect(component.changeDevice.emit).toHaveBeenCalledWith(pageViewAsInitialValue.device);
    });

    it('should load dropdowns with DotViewAsService values', () => {
        dotViewAsService.selected = pageViewAsPreLoadedValue;
        fixture.detectChanges();

        expect(component.viewAsConfig).toEqual(pageViewAsPreLoadedValue);
    });

    it('should emit changes in Language & save the new values in DotViewAsService', () => {
        const pDropDown: DebugElement = de.query(By.css('.view-as-toolbar-languages'));
        component.ngOnInit();
        spyOn(component.changeViewAs, 'emit');
        pDropDown.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        expect(component.changeViewAs.emit).toHaveBeenCalledWith(pageViewAsInitialValue);
        expect(dotViewAsService.selected).toEqual(pageViewAsInitialValue);
    });

    it('should emit changes in Personas & save the new values in DotViewAsService', () => {
        const pDropDown: DebugElement = de.query(By.css('.view-as-toolbar-personas'));
        component.ngOnInit();
        spyOn(component.changeViewAs, 'emit');
        pDropDown.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        expect(component.changeViewAs.emit).toHaveBeenCalledWith(pageViewAsInitialValue);
        expect(dotViewAsService.selected).toEqual(pageViewAsInitialValue);
    });

    it('should emit changes in Device & save the new values in DotViewAsService', () => {
        const pDropDown: DebugElement = de.query(By.css('.view-as-toolbar-devices'));
        component.ngOnInit();
        spyOn(component.changeDevice, 'emit');
        pDropDown.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        expect(component.changeDevice.emit).toHaveBeenCalledWith(pageViewAsInitialValue.device);
        expect(dotViewAsService.selected).toEqual(pageViewAsInitialValue);
    });
});
