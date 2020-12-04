import { Component, EventEmitter, Output } from '@angular/core';
import { DotMessageService } from '@services/dot-message/dot-messages.service';

@Component({
    selector: 'dot-dot-template-selector',
    templateUrl: './dot-template-selector.component.html',
    styleUrls: ['./dot-template-selector.component.scss']
})
export class DotTemplateSelectorComponent {
    value = 'design';

    map = {
        design: this.dotMessageService.get('templates.template.selector.design'),
        code: this.dotMessageService.get('templates.template.selector.advanced')
    };

    @Output()
    next = new EventEmitter<string>();

    constructor(private dotMessageService: DotMessageService) {}

    onClick(): void {
        this.next.emit(this.value);
    }
}
