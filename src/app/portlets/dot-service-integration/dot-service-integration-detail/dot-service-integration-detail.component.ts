import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { DotMessageService } from '@services/dot-messages-service';
// import { take, debounceTime } from 'rxjs/operators';
// import { fromEvent as observableFromEvent } from 'rxjs';
// import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';
import { DotServiceIntegration } from '@shared/models/dot-service-integration/dot-service-integration.model';
// import * as _ from 'lodash';
// import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    selector: 'dot-service-integration-detail',
    templateUrl: './dot-service-integration-detail.component.html'
    // styleUrls: ['./dot-service-integration-detail.component.scss']
})
export class DotServiceIntegrationDetailComponent implements OnInit {
    @ViewChild('searchInput')
    searchInput: ElementRef;
    messagesKey: { [key: string]: string } = {};
    serviceIntegrations: DotServiceIntegration[];
    serviceIntegrationsCopy: DotServiceIntegration[];

    constructor() {}

    ngOnInit() {

        console.log('2nd');
    }
}
