import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotDevicesService } from '../../../api/services/dot-devices/dot-devices.service';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { Observable } from 'rxjs/Observable';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { map } from 'rxjs/operators/map';
import { StringPixels } from '../../../api/util/string-pixels-util';
import { tap, take } from 'rxjs/operators';

@Component({
    selector: 'dot-device-selector',
    templateUrl: './dot-device-selector.component.html',
    styleUrls: ['./dot-device-selector.component.scss']
})
export class DotDeviceSelectorComponent implements OnInit {
    @Input() value: DotDevice;
    @Output() selected = new EventEmitter<DotDevice>();

    options: DotDevice[];
    readonly arrowDropdownComponentSize = 32;
    dropdownWidth: number;

    constructor(
        private dotDevicesService: DotDevicesService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnInit() {
        this.dotMessageService.getMessages(['editpage.viewas.default.device']).subscribe(() => {
            this.dotDevicesService
                .get()
                .pipe(
                    take(1),
                    tap((devices: DotDevice[]) => this.setDropdownWidth(devices)),
                    map((devices: DotDevice[]) => this.setOptions(this.dotMessageService.get('editpage.viewas.default.device'), devices))
                )
                .subscribe((devices: DotDevice[]) => {
                    this.options = devices;
                });
        });
    }

    /**
     * Track changes in the dropwdow
     * @param {DotDevice} device
     */
    change(device: DotDevice) {
        this.selected.emit(device);
    }

    private setOptions(message: string, devices: DotDevice[]): DotDevice[] {
        return [
            {
                name: message,
                cssHeight: '',
                cssWidth: '',
                inode: '0'
            },
            ...devices
        ];
    }

    private setDropdownWidth(devices: DotDevice[]): void {
        const optionValues = devices.map((deviceOption: DotDevice) => deviceOption.name);
        this.dropdownWidth = StringPixels.getWidth(optionValues) + this.arrowDropdownComponentSize;
    }
}
