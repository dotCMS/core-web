import { Component, ViewEncapsulation, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { SiteService, Site } from 'dotcms-js/dotcms-js';
import { IframeOverlayService } from '../_common/iframe/service/iframe-overlay.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-toolbar',
    styleUrls: ['./dot-toolbar.component.scss'],
    templateUrl: './dot-toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
    @Input() collapsed: boolean;
    @Output() mainButtonClick: EventEmitter<MouseEvent> = new EventEmitter();

    constructor(
        public iframeOverlayService: IframeOverlayService,
        private siteService: SiteService,
    ) {}

    ngOnInit(): void {
        this.siteService.refreshSites$.subscribe((_site: Site) => this.handleSitesRefresh(_site));
    }

    /**
     * Manage the sites refresh when a event happen
     * @param {Site} site
     * @memberof SiteSelectorComponent
     */
    handleSitesRefresh(site: any): void {
        // if current site is equal to the site updated (socket message) then switch to default site
        if (site.hostname === this.siteService.currentSite.hostname && site.archived) {
            this.siteService.getDefaultSite().subscribe((defaultSite: Site) => {
                this.siteChange(defaultSite);
            });
        }
    }

    siteChange(site: Site): void {
        this.siteService.switchSite(site);
    }

    handleMainButtonClick($event): void {
        $event.stopPropagation();
        this.mainButtonClick.emit($event);
    }
}
