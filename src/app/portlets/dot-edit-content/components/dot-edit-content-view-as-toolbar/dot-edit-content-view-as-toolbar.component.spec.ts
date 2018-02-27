import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditContentViewAsToolbarComponent } from './dot-edit-content-view-as-toolbar.component';
import { DotDevicesService } from '../../../../api/services/dot-devices/dot-devices.service';
import { DotLanguagesService } from '../../../../api/services/dot-languages/dot-languages.service';
import { DotPersonasService } from '../../../../api/services/dot-personas/dot-personas.service';
import { DotViewAsService } from '../../../../api/services/dot-view-as/dot-view-as.service';
import { Observable } from 'rxjs/Observable';
import { Device } from '../../../../shared/models/device/device.model';
import { Persona } from '../../../../shared/models/persona/persona.model';
import { Language } from '../../../../shared/models/language/language.model';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DotEditPageViewAs } from '../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { By } from '@angular/platform-browser';

class DotDevicesServiceMock {
    get(): Observable<Device[]> {
        return Observable.of([
            { id: '0', label: 'Desktop', width: '100%', height: '100%' },
            { id: '1', label: 'iPhone', width: '375px', height: '667px' }
        ]);
    }
}

class DotLanguagesServiceMock {
    get(): Observable<Language[]> {
        return Observable.of([{ id: 'en', label: 'English' }, { id: 'es', label: 'Spanish' }]);
    }
}

class DotPersonasServiceMock {
    get(): Observable<Persona[]> {
        return Observable.of([{ id: '1', label: 'Admin' }, { id: '2', label: 'Wealthy Prospect' }]);
    }
}

describe('DotEditContentViewAsToolbarComponent', () => {
    let component: DotEditContentViewAsToolbarComponent;
    let fixture: ComponentFixture<DotEditContentViewAsToolbarComponent>;
    let de: DebugElement;

    let dotDevicesService: DotDevicesService;
    let dotLanguagesService: DotLanguagesService;
    let dotPersonasService: DotPersonasService;
    let dotViewAsService: DotViewAsService;

    const pageViewAsPreLoadedValue: DotEditPageViewAs = {
        personaId: '2',
        languageId: 'es',
        device: { id: '1', label: 'iPhone', width: '375px', height: '667px' }
    };
    const pageViewAsInitialValue: DotEditPageViewAs = {
        personaId: '1',
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

        dotDevicesService = fixture.debugElement.injector.get(DotDevicesService);
        dotLanguagesService = fixture.debugElement.injector.get(DotLanguagesService);
        dotPersonasService = fixture.debugElement.injector.get(DotPersonasService);
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
        const pDropDown: DebugElement = de.query(By.css('.view-ass-toolbar-languages'));
        component.ngOnInit();
        spyOn(component.changeViewAs, 'emit');
        pDropDown.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        expect(component.changeViewAs.emit).toHaveBeenCalledWith(pageViewAsInitialValue);
        expect(dotViewAsService.selected).toEqual(pageViewAsInitialValue);
    });

    it('should emit changes in Personas & save the new values in DotViewAsService', () => {
        const pDropDown: DebugElement = de.query(By.css('.view-ass-toolbar-personas'));
        component.ngOnInit();
        spyOn(component.changeViewAs, 'emit');
        pDropDown.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        expect(component.changeViewAs.emit).toHaveBeenCalledWith(pageViewAsInitialValue);
        expect(dotViewAsService.selected).toEqual(pageViewAsInitialValue);
    });

    it('should emit changes in Device & save the new values in DotViewAsService', () => {
        const pDropDown: DebugElement = de.query(By.css('.view-ass-toolbar-devices'));
        component.ngOnInit();
        spyOn(component.changeDevice, 'emit');
        pDropDown.triggerEventHandler('onChange', {});
        fixture.detectChanges();

        expect(component.changeDevice.emit).toHaveBeenCalledWith(pageViewAsInitialValue.device);
        expect(dotViewAsService.selected).toEqual(pageViewAsInitialValue);
    });
});
