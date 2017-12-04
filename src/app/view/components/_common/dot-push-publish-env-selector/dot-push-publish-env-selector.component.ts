import { SelectItem } from 'primeng/primeng';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dot-push-publish-env-selector',
    styleUrls: ['./dot-push-publish-env-selector.component.scss'],
    templateUrl: 'dot-push-publish-env-selector.component.html'
})

export class PushPublishEnvSelectorComponent {
    servers: SelectItem[];

    constructor() {
        this.servers = [
            
        ];
    }
}
