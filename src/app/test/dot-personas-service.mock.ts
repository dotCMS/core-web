import { Observable } from 'rxjs/Observable';
import { DotPersona } from '../shared/models/dot-persona/dot-persona.model';

export class DotPersonasServiceMock {
    get(): Observable<DotPersona[]> {
        return Observable.of([
            {
                identifier: '1c56ba62-1f41-4b81-bd62-b6eacff3ad23',
                name: 'Global Investor',
            },
            {
                identifier: '2',
                name: 'Test User',
            }
        ]);
    }
}
