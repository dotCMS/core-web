import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { DotPersona } from '@models/dot-persona/dot-persona.model';
import { DotMessageService } from '@services/dot-messages-service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dot-persona-selected-item',
    templateUrl: './dot-persona-selected-item.component.html',
    styleUrls: ['./dot-persona-selected-item.component.scss']
})
export class DotPersonaSelectedItemComponent implements OnInit {
    @Input()
    persona: DotPersona;

    @Input()
    @HostBinding('class.disabled')
    disabled: boolean;

    messages: { [key: string]: string } = {};

    constructor(private dotMessageService: DotMessageService) {}

    ngOnInit() {
        this.dotMessageService
            .getMessages(['modes.persona.selector.title', 'modes.persona.no.persona'])
            .pipe(take(1))
            .subscribe((messages: { [key: string]: string }) => {
                this.messages = messages;
            });
    }
}
