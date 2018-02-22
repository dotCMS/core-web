import { Injectable } from '@angular/core';
import { Persona } from '../../../shared/models/persona/persona.model';
import { Observable } from 'rxjs/Observable';
import { CoreWebService } from 'dotcms-js/dotcms-js';

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
     * @returns {Observable<Language[]>}
     * @memberof DotPersonasService
     */
    get(): Observable<Persona[]> {
        return Observable.of([
            { id: '1', label: 'Admin' },
            { id: '2', label: 'Wealthy Prospect' },
            { id: '3', label: 'Global Investor' },
            { id: '4', label: 'First Time investor' }
        ]);
    }
}
