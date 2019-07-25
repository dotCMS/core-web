import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { DotPersona } from '@models/dot-persona/dot-persona.model';

@Component({
    selector: 'dot-persona-dropdown-selector',
    templateUrl: './dot-persona-dropdown-selector.component.html',
    styleUrls: ['./dot-persona-dropdown-selector.component.scss']
})
export class DotPersonaDropdownSelectorComponent {
    @Input()
    persona: DotPersona;
    @Input()
    label: string;
    @Output()
    selected = new EventEmitter<MouseEvent>();

    constructor() {}

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent) {
        $event.stopPropagation();
        this.selected.emit($event);
    }
}
