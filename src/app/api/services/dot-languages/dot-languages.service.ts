import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../../shared/models/language/language.model';

/**
 * Provide util methods to get Languages available in the system.
 * @export
 * @class DotLanguagesService
 */
@Injectable()
export class DotLanguagesService {
    constructor() {}

    /**
     * Return languages.
     * @returns {Observable<Language[]>}
     * @memberof DotLanguagesService
     */
    get(): Observable<Language[]> {
        return Observable.of([
            { id: 'en', label: 'English' },
            { id: 'es', label: 'Spanish' },
            { id: 'fr', label: 'French' }
        ]);
    }
}
