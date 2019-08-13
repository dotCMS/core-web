import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';
import { DotPageStateService } from '@portlets/dot-edit-page/content/services/dot-page-state/dot-page-state.service';
import { DotPageMode, DotRenderedPageState } from '@portlets/dot-edit-page/shared/models';

@Component({
    selector: 'dot-persona-selected-item',
    templateUrl: './dot-persona-selected-item.component.html',
    styleUrls: ['./dot-persona-selected-item.component.scss']
})
export class DotPersonaSelectedItemComponent implements OnInit {
    @Input()
    persona: DotPersona;

    @Output()
    selected = new EventEmitter<MouseEvent>();

    isEditMode = false;
    messages: { [key: string]: string } = {};

    constructor(
        private dotMessageService: DotMessageService,
        private dotPageStateService: DotPageStateService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages([
                'modes.persona.selector.title.preview',
                'modes.persona.selector.title.edit',
                'modes.persona.no.persona'
            ])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
                console.log('this.messages', this.messages);
            });

        this.dotPageStateService.state$.subscribe((dotRenderedPageState: DotRenderedPageState) => {
            this.isEditMode = dotRenderedPageState.state.mode === DotPageMode.EDIT;
        });
    }

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent) {
        this.selected.emit($event);
    }
}
