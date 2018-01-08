import { Injectable, OnInit } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { DotEventsService } from '../../../../api/services/dot-events/dot-events.service';
import { DotGlobalMessage } from '../../../../shared/models/dot-global-message/dot-global-message.model';

/**
 *  Service to provide configurations for Global Messages.
 */
@Injectable()
export class DotGlobalMessageService implements OnInit {
    private config: DotGlobalMessage;

    constructor(public dotMessageService: DotMessageService, private dotEventsService: DotEventsService) {}

    ngOnInit(): void {
        this.dotMessageService.getMessages(['dot.common.message.loading', 'dot.common.message.loaded']).subscribe();
    }

    /**
     * Display text messages.
     * @param {string} message
     */
    display(message: string): void {
        this.config = {
            value: message ? message : this.dotMessageService.get('dot.common.message.loaded'),
            life: 3000
        };
        this.dotEventsService.notify('dot-global-message', this.config);
    }

    /**
     * Display text messages with a loading indicator.
     * @param {string} message
     */
    loading(message?: string): void {
        this.config = {
            value: message ? message : this.dotMessageService.get('dot.common.message.loading'),
            type: 'loading',
        };
        this.dotEventsService.notify('dot-global-message', this.config);
    }

    /**
     * Display text messages with error configuration.
     * @param {string} message
     */
    error(message: string): void {
        // TODO: Define the behavior of error messages.
        this.config = {
            value: message,
            life: 3000
        };
        this.dotEventsService.notify('dot-global-message', this.config);
    }
}
