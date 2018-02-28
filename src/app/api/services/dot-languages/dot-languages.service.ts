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
    get(): Observable<any> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'v1/languages'
            })
            .pluck('bodyJsonObject')
            .map(response => // Doing this transformation, because of the end point response.
                Object.keys(response).map(language => {
                    return {
                        id: language,
                        label: response[language].name
                    };
                })
            );
    }
}
