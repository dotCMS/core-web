import { Observable } from 'rxjs/Observable';
import { DotDevice } from '../shared/models/dot-device/dot-device.model';

export class DotDevicesServiceMock {
    get(): Observable<DotDevice[]> {
        return Observable.of([
            { id: '0', label: 'Desktop', width: '100%', height: '100%' },
            { id: '1', label: 'iPhone', width: '375px', height: '667px' }
        ]);
    }
}
