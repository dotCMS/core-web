import { ComponentFixture } from '@angular/core/testing';

import { DotDeviceSelectorComponent } from './dot-device-selector.component';
import { DebugElement } from '@angular/core';
import { DOTTestBed } from '../../../test/dot-test-bed';
import { DotDevicesService } from '../../../api/services/dot-devices/dot-devices.service';
import { DotDevicesServiceMock } from '../../../test/dot-device-service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

xdescribe('DotDeviceSelectorComponent', () => {
    let component: DotDeviceSelectorComponent;
    let fixture: ComponentFixture<DotDeviceSelectorComponent>;
    let de: DebugElement;

    beforeEach(() => {
        DOTTestBed.configureTestingModule({
            declarations: [DotDeviceSelectorComponent],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: DotDevicesService,
                    useClass: DotDevicesServiceMock
                }
            ]
        });

        fixture = DOTTestBed.createComponent(DotDeviceSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
