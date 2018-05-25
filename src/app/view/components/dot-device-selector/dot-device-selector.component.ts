import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotDevicesService } from '../../../api/services/dot-devices/dot-devices.service';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { Observable } from 'rxjs/Observable';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { map } from 'rxjs/operators/map';
import { StringPixels } from '../../../api/util/stringPixels';
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
    arrowDropdownlComponentSize = 32;
    dropdownWidth: string;

    constructor(
        private dotDevicesService: DotDevicesService,
        private dotMessageService: DotMessageService,
        private stringPixels: StringPixels
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
        const maxTextOption = _.maxBy(devices, (deviceOption: DotDevice) => deviceOption.name.length).name;
        const dropdownSize = this.stringPixels.getTextWidth(maxTextOption) + this.arrowDropdownlComponentSize;
        this.dropdownWidth = `${dropdownSize}px`;
    }
}
