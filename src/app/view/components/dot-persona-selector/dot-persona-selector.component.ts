import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
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

    personasOptions: SelectItem[];

    constructor(private dotPersonasService: DotPersonasService, private dotMessageService: DotMessageService) {}

    ngOnInit() {
        Observable.forkJoin(
            this.dotPersonasService.get(),
            this.dotMessageService.getMessages(['modes.persona.no.persona'])
        ).subscribe(response => {
            this.personasOptions = [
                { label: response[1]['modes.persona.no.persona'], value: { identifier: '0' } },
                ...response[0].map(persona => ({ label: persona.name, value: persona }))
            ];
            this.value = this.value || this.personasOptions[0].value;
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
