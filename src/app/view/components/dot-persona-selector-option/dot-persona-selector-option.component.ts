import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
// import { DotPersonasService } from '@services/dot-personas/dot-personas.service';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';

interface PersonalizationField {
    keyTag: string;
    pageId: string;
}

@Component({
    selector: 'dot-persona-selector-option',
    templateUrl: './dot-persona-selector-option.component.html',
    styleUrls: ['./dot-persona-selector-option.component.scss']
})
export class DotPersonaSelectorOptionComponent implements OnInit {
    @Input()
    persona: DotPersona;
    @Output()
    selected = new EventEmitter<DotPersona>();
    @Output()
    delete = new EventEmitter<PersonalizationField>();

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['modes.persona.personalized'])
            .pipe(take(1))
            .subscribe();
    }

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent) {
        $event.stopPropagation();
        this.selected.emit(this.persona);
    }

    /**
     * Emit the personalized field to be removed
     * @param {MouseEvent} $event
     * @memberof DotPersonaSelectorOptionComponent
     */
    deletePersonalized($event: MouseEvent) {
        $event.stopPropagation();
        this.delete.emit({
            keyTag: this.persona.keyTag,
            pageId: ''
        });
    }
}
