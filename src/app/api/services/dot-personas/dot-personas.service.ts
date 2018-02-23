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

    private _selectedPersona: string;

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

    get selectedPersona(): string {
        return this._selectedPersona;
    }
    set selectedPersona(personaId: string) {
        this._selectedPersona = personaId;
    }
}
