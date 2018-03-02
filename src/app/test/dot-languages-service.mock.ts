import { Observable } from 'rxjs/Observable';
import { DotLanguage } from '../shared/models/dot-language/dot-language.model';

export class DotLanguagesServiceMock {
    get(): Observable<DotLanguage[]> {
        return Observable.of([
            { id: 1, languageCode: 'en', countryCode: 'US', language: 'English', country: 'United States' }
        ]);
    }
}
