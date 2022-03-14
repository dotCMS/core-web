import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

// eslint-disable-next-line max-len
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface DotLanguage {
    country: string;
    countryCode: string;
    defaultLanguage: boolean;
    id: number;
    language: string;
    languageCode: string;
}

export interface Languages {
    [key: string]: DotLanguage;
}

@Injectable({
    providedIn: 'root'
})
export class DotLanguageService {
    public language: Languages;

    constructor(private http: HttpClient) {}

    get defaultHeaders() {
        const headers = new HttpHeaders();
        headers.set('Accept', '*/*').set('Content-Type', 'application/json');
        return headers;
    }

    getLanguages(): Observable<Languages> {
        if (this.language) {
            return of(this.language);
        }

        return this.http
            .get(`/api/v2/languages`, {
                headers: this.defaultHeaders
            })
            .pipe(
                pluck('entity'),
                map((lang: DotLanguage[]) => {
                    const dotLang: Languages = this.getDotLanguageObject(lang);

                    this.language = dotLang;

                    return dotLang;
                })
            );
    }

    /**
     * Transform an array of languages into a object
     * using the language id as a object key.
     * @private
     * @param {DotLanguage[]} lang
     * @return {*}  {Languages}
     * @memberof DotLanguageService
     */
    private getDotLanguageObject(lang: DotLanguage[]): Languages {
        return lang.reduce((obj, lang) => Object.assign(obj, { [lang.id]: lang }), {});
    }
}
