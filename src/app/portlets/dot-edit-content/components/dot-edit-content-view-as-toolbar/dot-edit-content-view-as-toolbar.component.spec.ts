import { ComponentFixture } from '@angular/core/testing';
import { DotEditContentViewAsToolbarComponent } from './dot-edit-content-view-as-toolbar.component';
import { DotDevicesService } from '../../../../api/services/dot-devices/dot-devices.service';
import { DotLanguagesService } from '../../../../api/services/dot-languages/dot-languages.service';
import { DotPersonasService } from '../../../../api/services/dot-personas/dot-personas.service';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DotDevicesServiceMock } from '../../../../test/dot-device-service.mock';
import { DotLanguagesServiceMock } from '../../../../test/dot-languages-service.mock';
import { DotPersonasServiceMock } from '../../../../test/dot-personas-service.mock';
import { mockDotPersona } from '../../../../test/dot-persona.mock';
import { mockDotLanguage } from '../../../../test/dot-language.mock';
import { mockDotDevice } from '../../../../test/dot-device.mock';
import { DotPersona } from '../../../../shared/models/dot-persona/dot-persona.model';
import { DotDevice } from '../../../../shared/models/dot-device/dot-device.model';
import { DotLanguage } from '../../../../shared/models/dot-language/dot-language.model';
import { mockDotEditPageViewAs } from '../../../../test/dot-edit-page-view-as.mock';

@Component({
    selector: 'dot-persona-selector',
    template: ''
})
class MockDotPersonaSelectorComponent {
    @Input() value: DotPersona;
    @Output() selectedPersona = new EventEmitter<DotPersona>();
}

@Component({
    selector: 'dot-device-selector',
    template: ''
})
class MockDotDeviceSelectorComponent {
    @Input() value: DotDevice;
    @Output() selectedDevice = new EventEmitter<DotDevice>();
}

@Component({
    selector: 'dot-language-selector',
    template: ''
})
class MockDotLanguageSelectorComponent {
    @Input() value: DotLanguage;
    @Output() selectedLanguage = new EventEmitter<DotLanguage>();
}

describe('DotEditContentViewAsToolbarComponent', () => {
    let component: DotEditContentViewAsToolbarComponent;
    let fixture: ComponentFixture<DotEditContentViewAsToolbarComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [
                DotEditContentViewAsToolbarComponent,
                MockDotPersonaSelectorComponent,
                MockDotDeviceSelectorComponent,
                MockDotLanguageSelectorComponent
            ],
            imports: [BrowserAnimationsModule],
            providers: [
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
    });

    it('should have Persona selector', () => {
        const toolbarElement: DebugElement = de.query(By.css('dot-persona-selector'));
        expect(toolbarElement).not.toBeNull();
    });

    it('should emit changes in Personas', () => {
        component.value = mockDotEditPageViewAs;
        const personaSelector: DebugElement = de.query(By.css('dot-persona-selector'));
        spyOn(component, 'changePersonaHandler').and.callThrough();
        spyOn(component.changeViewAs, 'emit');
        personaSelector.componentInstance.selectedPersona.emit(mockDotPersona);
        fixture.detectChanges();

        expect(component.changePersonaHandler).toHaveBeenCalledWith(mockDotPersona);
        expect(component.changeViewAs.emit).toHaveBeenCalledWith(mockDotEditPageViewAs);
    });

    it('should have Device selector', () => {
        const toolbarElement: DebugElement = de.query(By.css('dot-device-selector'));
        expect(toolbarElement).not.toBeNull();
    });

    it('should emit changes in Device', () => {
        component.value = mockDotEditPageViewAs;
        const deviceSelector: DebugElement = de.query(By.css('dot-device-selector'));
        spyOn(component, 'changeDeviceHandler').and.callThrough();
        spyOn(component.changeDevice, 'emit');
        deviceSelector.componentInstance.selectedDevice.emit(mockDotDevice);
        fixture.detectChanges();

        expect(component.changeDeviceHandler).toHaveBeenCalledWith(mockDotDevice);
        expect(component.changeDevice.emit).toHaveBeenCalledWith(mockDotDevice);
    });

    it('should have Language selector', () => {
        const toolbarElement: DebugElement = de.query(By.css('dot-language-selector'));
        expect(toolbarElement).not.toBeNull();
    });

    it('should emit changes in Language', () => {
        component.value = mockDotEditPageViewAs;
        const languageSelector: DebugElement = de.query(By.css('dot-language-selector'));
        spyOn(component, 'changeLanguageHandler').and.callThrough();
        spyOn(component.changeViewAs, 'emit');
        languageSelector.componentInstance.selectedLanguage.emit(mockDotLanguage);
        fixture.detectChanges();

        expect(component.changeLanguageHandler).toHaveBeenCalledWith(mockDotLanguage);
        expect(component.changeViewAs.emit).toHaveBeenCalledWith(mockDotEditPageViewAs);
    });

    it('should propagate the values to the selector components on init', () => {
        component.value = mockDotEditPageViewAs;
        const languageSelector: DebugElement = de.query(By.css('dot-language-selector'));
        const deviceSelector: DebugElement = de.query(By.css('dot-device-selector'));
        const personaSelector: DebugElement = de.query(By.css('dot-persona-selector'));
        fixture.detectChanges();

        expect(languageSelector.componentInstance.value).toEqual(mockDotEditPageViewAs.language);
        expect(deviceSelector.componentInstance.value).toEqual(mockDotEditPageViewAs.device);
        expect(personaSelector.componentInstance.value).toEqual(mockDotEditPageViewAs.persona);
    });
});
