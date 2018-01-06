import { Component, ViewEncapsulation, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { SiteService, Site } from 'dotcms-js/dotcms-js';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';
import { DotEventsService } from '../../../api/services/dot-events/dot-events.service';
import { DotEvent } from '../../../shared/models/dot-event/dot-event';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-toolbar',
    styleUrls: ['./dot-toolbar.component.scss'],
    templateUrl: './dot-toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
    @Input() collapsed: boolean;
    @Output() mainButtonClick: EventEmitter<MouseEvent> = new EventEmitter();
    messageConfig = '';
    messageValue = '';

    constructor(
        public iframeOverlayService: IframeOverlayService,
        private siteService: SiteService,
        private dotEventsService: DotEventsService
    ) {}

    ngOnInit() {
        this.dotEventsService.listen('dot-toolbar-message').subscribe((event: DotEvent) => {
            this.messageConfig = event.data.config;
            this.messageValue = event.data.messageValue;
        });
    }

    siteChange(site: Site): void {
        this.siteService.switchSite(site);
    }

    handleMainButtonClick($event): void {
        $event.stopPropagation();
        this.mainButtonClick.emit($event);
    }
}
