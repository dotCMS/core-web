import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotDevice } from '../../../shared/models/dot-device/dot-device.model';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { RequestMethod } from '@angular/http';

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
     * @returns {Observable<DotDevice[]>}
     * @memberof DotDevicesService
     */
    get(): Observable<DotDevice[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'content/render/false/query/+contentType:previewDevice'
            })
            .pluck('contentlets');
    }

    // /**
    //  * Add 'px' string to the dimension values in device.
    //  * @param {DotDevice} device
    //  * @returns {DotDevice}
    //  * @memberof DotDevicesService
    //  */
    // addPixelDimension(device: DotDevice): DotDevice {
    //     device.cssHeight += 'px';
    //     device.cssWidth += 'px';
    //     return device;
    // }
}
