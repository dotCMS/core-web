import { Observable } from 'rxjs/Observable';
import { DotDevice } from '../shared/models/dot-device/dot-device.model';

export class DotDevicesServiceMock {
    get(): Observable<DotDevice[]> {
        return Observable.of([
            { cssHeight: '100', cssWidth: '200', name: 'iphone' },
            { cssHeight: '200', cssWidth: '400', name: 'Pixel' }
        ]);
    }
}
