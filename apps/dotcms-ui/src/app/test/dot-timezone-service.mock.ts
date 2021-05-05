import { DotTimeZone } from '@services/dot-timezone/dot-timezone.service';
import { Observable, of } from 'rxjs';
import { mockDotTimeZones } from './dot-timezone.mock';

export class DotTimeZoneServiceMock {
    get(): Observable<DotTimeZone[]> {
        return of(mockDotTimeZones);
    }
}
