import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotDevicesService } from '../../../api/services/dot-devices/dot-devices.service';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dot-device-selector',
    templateUrl: './dot-device-selector.component.html',
    styleUrls: ['./dot-device-selector.component.scss']
})
export class DotDeviceSelectorComponent implements OnInit {
    @Input() value: DotDevice;
    @Output() selectedDevice = new EventEmitter<DotDevice>();

    devicesOptions: Observable<DotDevice[]>;

    constructor(private dotDevicesService: DotDevicesService) {}

    ngOnInit() {
        this.devicesOptions = this.dotDevicesService.get();
    }

    /**
     * Track changes in the dropwdow
     * @param {DotDevice} device
     */
    changeDevice(device: DotDevice) {
        this.selectedDevice.emit(device);
    }
}
