import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { Device } from '../../../shared/models/device/device.model';

/**
 * Provide util methods to get the Devices & dimensions.
 * @export
 * @class DotDevicesService
 */
@Injectable()
export class DotDevicesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Return available devices.
     * @returns {Observable<Device[]>}
     * @memberof DotDevicesService
     */
    get(): Observable<Device[]> {
        return Observable.of([
            { id: '0', label: 'iPhone', width: '375', height: '667' },
            { id: '1', label: 'iPad Pro', width: '1024', height: '1366' },
            { id: '2', label: 'iPad 3, 4, Air, Air2', width: '768', height: '1024' }
        ]);
    }

    /**
     * Get a device given the id.
     * @param {string} id
     * @returns {Device}
     */
    getDimensions(id: string): Device {
        return { id: '0', label: 'iPhone', width: '375', height: '667' };
    }
}
