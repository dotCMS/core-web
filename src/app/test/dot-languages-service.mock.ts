import { Observable } from 'rxjs/Observable';
import { DotLanguage } from '../shared/models/dot-language/dot-language.model';

export class DotLanguagesServiceMock {
    get(): Observable<DotLanguage[]> {
        return Observable.of([{ id: 'en', label: 'English' }, { id: 'es', label: 'Spanish' }]);
    }
}
