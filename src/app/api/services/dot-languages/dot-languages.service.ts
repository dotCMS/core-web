import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DotLanguage } from '../../../shared/models/dot-language/dot-language.model';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js/dotcms-js';

/**
 * Provide util methods to get Languages available in the system.
 * @export
 * @class DotLanguagesService
 */
@Injectable()
export class DotLanguagesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Return languages.
     * @returns {Observable<DotLanguage[]>}
     * @memberof DotLanguagesService
     */
    get(): Observable<DotLanguage[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'v2/languages'
            })
            .pluck('entity');
    }
}
