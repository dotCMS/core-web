import * as _ from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DotPersonasService } from '../../../api/services/dot-personas/dot-personas.service';
import { DotPersona } from '../../../shared/models/dot-persona/dot-persona.model';
import { Observable } from 'rxjs/Observable';
import { DotMessageService } from '../../../api/services/dot-messages-service';
import { mergeMap, map, tap } from 'rxjs/operators';
import { StringPixels } from '../../../api/util/stringPixels';

@Component({
    selector: 'dot-persona-selector',
    templateUrl: './dot-persona-selector.component.html',
    styleUrls: ['./dot-persona-selector.component.scss']
})
export class DotPersonaSelectorComponent implements OnInit {
    @Input() value: DotPersona;
    @Output() selected = new EventEmitter<DotPersona>();

    options: DotPersona[];
    arrowDropdownlComponentSize = 32;
    dropdownWidth: string;

    constructor(
        private dotPersonasService: DotPersonasService,
        private dotMessageService: DotMessageService,
        private stringPixels: StringPixels
    ) {}

    ngOnInit() {
        this.dotMessageService.getMessages(['modes.persona.no.persona']).subscribe(() => {
            this.dotPersonasService
                .get()
                .pipe(
                    tap((personas: DotPersona[]) => {
                        this.setDropdownWidth(personas);
                    }),
                    map((personas: DotPersona[]) => this.setOptions(this.dotMessageService.get('modes.persona.no.persona'), personas))
                )
                .subscribe((personas: DotPersona[]) => {
                    this.options = personas;
                });
        });
    }

    /**
     * Track changes in the dropwdow
     * @param {DotPersona} persona
     */
    change(persona: DotPersona) {
        this.selected.emit(persona);
    }

    private setOptions(message: string, personas: DotPersona[]): DotPersona[] {
        return [{ name: message, identifier: '0' }, ...personas];
    }

    private setDropdownWidth(personas: DotPersona[]): void {
        const maxTextOption = _.maxBy(personas, (personaOption: DotPersona) => personaOption.name.length).name;
        const dropdownSize = this.stringPixels.getTextWidth(maxTextOption) + this.arrowDropdownlComponentSize;
        this.dropdownWidth = `${dropdownSize}px`;
    }
}
