import { pluck, flatMap, map, toArray } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { CoreWebService } from 'dotcms-js';

interface DotPersonalizedPersona {
    pageId: string;
    personalized: boolean;
    persona: DotPersona;
}

/**
 * Provide util methods to get Personas.
 * @export
 * @class DotPersonasService
 */
@Injectable()
export class DotPersonasService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Return Personas.
     * @returns Observable<DotLanguage[]>
     * @memberof DotPersonasService
     */
    get(): Observable<DotPersona[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url:
                    'content/respectFrontendRoles/false/render/false/query/contentType:persona live:true deleted:false working:true'
            })
            .pipe(pluck('contentlets'));
    }

    getByPage(pageId: string): Observable<DotPersona[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `/api/v1/personalization/pagepersonas/${pageId}`
            })
            .pipe(
                pluck('entity'),
                flatMap((items: DotPersonalizedPersona[]) => items),
                map((item: DotPersonalizedPersona) => {
                    return {
                        ...item.persona,
                        pageId: item.pageId,
                        personalized: item.personalized
                    };
                }),
                toArray()
            );
    }

    personalized(pageId: string, personaTag: string): Observable<any> {
        return this.coreWebService.requestView({
            method: RequestMethod.Post,
            url: `/api/v1/personalization/pagepersonas`,
            body: {
                pageId,
                personaTag
            }
        });
    }

    despersonalized(pageId: string, personaTag: string): Observable<any> {
        return this.coreWebService.requestView({
            method: RequestMethod.Delete,
            url: `/api/v1/personalization/pagepersonas/page/${pageId}/personalization/${personaTag}`
        });
    }
}
