import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotPersonasService } from '../../../api/services/dot-personas/dot-personas.service';
import { DotPersona } from '../../../shared/models/dot-persona/dot-persona.model';
import { Observable } from 'rxjs/Observable';
import { DotMessageService } from '../../../api/services/dot-messages-service';

@Component({
    selector: 'dot-persona-selector',
    templateUrl: './dot-persona-selector.component.html',
    styleUrls: ['./dot-persona-selector.component.scss']
})
export class DotPersonaSelectorComponent implements OnInit {
    @Input() value: DotPersona;
    @Output() selectedPersona = new EventEmitter<DotPersona>();

    personasOptions: DotPersona[];

    constructor(private dotPersonasService: DotPersonasService, private dotMessageService: DotMessageService) {}

    ngOnInit() {
        Observable.forkJoin(
            this.dotPersonasService.get(),
            this.dotMessageService.getMessages(['modes.persona.no.persona'])
        ).subscribe(response => {
            this.personasOptions = [{ name: response[1]['modes.persona.no.persona'], identifier: '0' }, ...response[0]];
        });
    }

    /**
     * Track changes in the dropwdow
     * @param {DotPersona} persona
     */
    changePersona(persona: DotPersona) {
        this.selectedPersona.emit(persona);
    }
}
