import { Component, OnInit } from '@angular/core';
import { DotGlobalMessage } from '../../../../shared/models/dot-global-message/dot-global-message.model';
import { DotEventsService } from '../../../../api/services/dot-events/dot-events.service';
import { DotEvent } from '../../../../shared/models/dot-event/dot-event';

@Component({
    selector: 'dot-global-message',
    templateUrl: './dot-global-message.component.html',
    styleUrls: ['./dot-global-message.component.scss']
})
export class DotGlobalMessageComponent implements OnInit {
    visibilityStatus = false;
    message: DotGlobalMessage = { value: '' };

    private icons = {
        loading: 'fa fa-circle-o-notch fa-spin'
    };

    constructor(private dotEventsService: DotEventsService) {}

    ngOnInit() {
        this.dotEventsService.listen('dot-global-message').subscribe((event: DotEvent) => {
            this.message = event.data;
            this.visibilityStatus = true;
            this.message.type = this.icons[this.message.type] || '';
            if (this.message.life) {
                setTimeout(() => {
                    this.visibilityStatus = false;
                }, this.message.life);
            }
        });
    }
}
