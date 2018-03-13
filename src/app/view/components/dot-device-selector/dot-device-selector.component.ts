import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotDevicesService } from '../../../api/services/dot-devices/dot-devices.service';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { Observable } from 'rxjs/Observable';
import { DotMessageService } from '../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-device-selector',
    templateUrl: './dot-device-selector.component.html',
    styleUrls: ['./dot-device-selector.component.scss']
})
export class DotDeviceSelectorComponent implements OnInit {
    @Input() value: DotDevice;
    @Output() selectedDevice = new EventEmitter<DotDevice>();

    devicesOptions: DotDevice[];

    constructor(private dotDevicesService: DotDevicesService, private dotMessageService: DotMessageService) {}

    ngOnInit() {

        Observable.forkJoin(
            this.dotDevicesService.get(),
            this.dotMessageService.getMessages(['editpage.viewas.default.device'])
        ).subscribe(response => {
            this.devicesOptions = [
                { name: response[1]['editpage.viewas.default.device'], cssHeight: '100%', cssWidth: '100%' },
                ...response[0].map((device: DotDevice) => {
                    device.cssHeight += 'px';
                    device.cssWidth += 'px';
                    return device;
                })
            ];
            if (!this.value) {
                this.changeDevice(this.devicesOptions[0]);
            }
        });
    }

    /**
     * Track changes in the dropwdow
     * @param {DotDevice} device
     */
    changeDevice(device: DotDevice) {
        this.selectedDevice.emit(device);
    }
}
