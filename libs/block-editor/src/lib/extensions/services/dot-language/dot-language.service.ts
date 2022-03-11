import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

// eslint-disable-next-line max-len
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Language {
    country: string;
    countryCode: string;
    defaultLanguage: boolean;
    id: number;
    language: string;
    languageCode: string;
}

export interface DotLanguage {
    [key: string]: Language;
}

@Injectable({
    providedIn: 'root'
})
export class DotLanguageService {
    public language: DotLanguage;

    constructor(private http: HttpClient) {}

    get defaultHeaders() {
        const headers = new HttpHeaders();
        headers.set('Accept', '*/*').set('Content-Type', 'application/json');
        return headers;
    }

    getLanguages(): Observable<DotLanguage> {
        if (this.language) {
            return of(this.language);
        }

        return this.http
            .get(`/api/v2/languages`, {
                headers: this.defaultHeaders
            })
            .pipe(
                pluck('entity'),
                map((lang: Language[]) => {
                    const dotLang: DotLanguage = lang.reduce(
                        (obj, lang) => Object.assign(obj, { [lang.id]: lang }),
                        {}
                    );

                    this.language = dotLang;

                    return dotLang;
                })
            );
    }
}
