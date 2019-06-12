import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { DotPersonasService } from '@services/dot-personas/dot-personas.service';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotMessageService } from '@services/dot-messages-service';
import { map, take, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'dot-persona-selector',
    templateUrl: './dot-persona-selector.component.html',
    styleUrls: ['./dot-persona-selector.component.scss']
})
export class DotPersonaSelectorComponent implements OnInit, OnChanges {
    @Input() pageIdentifier: string;
    @Input() value: DotPersona;
    @Output() selected = new EventEmitter<DotPersona>();

    options$: Observable<DotPersona[]>;

    constructor(
        private dotPersonasService: DotPersonasService,
        private dotMessageService: DotMessageService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.options$ = this.getOptions();
        }
    }

    ngOnInit() {
        this.options$ = this.getOptions();
    }

    /**
     * Track changes in the dropwdow
     * @param DotPersona persona
     */
    change(persona: DotPersona) {
        this.selected.emit(persona);
    }

    private setOptions(message: string, personas: DotPersona[]): DotPersona[] {
        return [{ name: message, identifier: '0' }, ...personas];
    }

    private getOptions(): Observable<DotPersona[]> {
        return this.dotMessageService.getMessages(['modes.persona.no.persona']).pipe(
            take(1),
            switchMap(() => {
                return this.dotPersonasService
                    .getByPage(this.pageIdentifier)
                    .pipe(
                        map((personas: DotPersona[]) =>
                            this.setOptions(
                                this.dotMessageService.get('modes.persona.no.persona'),
                                personas
                            )
                        )
                    );
            })
        );
    }
}
