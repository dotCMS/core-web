import { Observable } from 'rxjs/Observable';
import { DotDevice } from '../shared/models/dot-device/dot-device.model';
import { mockDotDevice } from './dot-device.mock';

export class DotDevicesServiceMock {
    get(): Observable<DotDevice[]> {
        return Observable.of([mockDotDevice]);
    }

    /**
     * Add 'px' string to the dimension values in device.
     * @param {DotDevice} device
     * @returns {DotDevice}
     * @memberof DotDevicesService
     */
    addPixelDimension(device: DotDevice): DotDevice {
        device.cssHeight += 'px';
        device.cssWidth += 'px';
        return device;
    }
}
