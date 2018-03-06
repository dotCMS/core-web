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
import { MockDotMessageService } from '../../../../test/dot-message-service.mock';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

describe('DotEditContentViewAsToolbarComponent', () => {
    let component: DotEditContentViewAsToolbarComponent;
    let fixture: ComponentFixture<DotEditContentViewAsToolbarComponent>;
    let de: DebugElement;
    let dotViewAsService: DotViewAsService;

    const pageViewAsPreLoadedValue: DotEditPageViewAs = {
        persona: {
            description: 'A non-US based investor interested in global financial news and services',
            folder: 'SYSTEM_FOLDER',
            host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
            identifier: 'testID',
            inode: 'f30e6dc9-e951-4f71-bb1c-a98b49238806',
            keyTag: 'Manager',
            languageId: 1,
            lastReview: '2016-02-19 11:21:03.788',
            modDate: '2016-02-19 11:21:03.802',
            modUser: 'dotcms.org.1',
            name: 'Manager',
            owner: 'dotcms.org.1',
            photoContentAsset: '1c56ba62-1f41-4b81-bd62-b6eacff3ad23/photo',
            sortOrder: 0,
            stInode: 'c938b15f-bcb6-49ef-8651-14d455a97045'
        },
        language: { id: 1, languageCode: 'en', countryCode: 'US', language: 'English', country: 'United States' },
        device: { id: '1', label: 'iPhone', width: '375px', height: '667px' }
    };
    const pageViewAsInitialValue: DotEditPageViewAs = {
        persona: { identifier: '0' },
        language: { id: 1, languageCode: 'en', countryCode: 'US', language: 'English', country: 'United States' },
        device: { id: '0', label: 'Desktop', width: '100%', height: '100%' }
    };

    beforeEach(() => {
        const messageServiceMock = new MockDotMessageService({
            'modes.persona.no.persona': 'Default Persona'
        });

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
                },
                {
                    provide: DotMessageService,
                    useValue: messageServiceMock
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
