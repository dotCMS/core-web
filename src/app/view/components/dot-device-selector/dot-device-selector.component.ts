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
    @Output() selected = new EventEmitter<DotDevice>();

    devicesOptions: DotDevice[];

    constructor(private dotDevicesService: DotDevicesService, private dotMessageService: DotMessageService) {}

    ngOnInit() {
        Observable.forkJoin(
            this.dotDevicesService.get(),
            this.dotMessageService.getMessages(['editpage.viewas.default.device'])
        ).subscribe(([devices, messages]) => {
            this.devicesOptions = [
                {
                    name: messages['editpage.viewas.default.device'],
                    cssHeight: '100%',
                    cssWidth: '100%',
                    inode: '0'
                },
                ...devices.map((device: DotDevice) => this.addPixelDimension(device))
            ];
        });
    }

    /**
     * Track changes in the dropwdow
     * @param {DotDevice} device
     */
    change(device: DotDevice) {
        this.selected.emit(device);
    }

    private addPixelDimension(device: DotDevice): DotDevice {
        device.cssHeight += 'px';
        device.cssWidth += 'px';
        return device;
    }
}
