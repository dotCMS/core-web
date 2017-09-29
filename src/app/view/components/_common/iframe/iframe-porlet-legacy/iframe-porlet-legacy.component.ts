import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { SiteService, DotcmsEventsService, LoggerService } from 'dotcms-js/dotcms-js';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { Observable } from 'rxjs/Observable';
import { DotRouterService } from '../../../../../api/services/dot-router-service';
import { ContentletService } from '../../../../../api/services/contentlet.service';
import { DotLoadingIndicatorService } from '../dot-loading-indicator/dot-loading-indicator.service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-iframe-porlet',
    templateUrl: 'iframe-porlet-legacy.component.html'
})
export class IframePortletLegacyComponent implements OnInit {
    @ViewChild('iframe') iframe;
    url: Observable<string>;

    constructor(
        private dotcmsEventsService: DotcmsEventsService,
        private route: ActivatedRoute,
        private dotNavigationService: DotMenuService,
        private dotRouterService: DotRouterService,
        public loggerService: LoggerService,
        public siteService: SiteService,
        private contentletService: ContentletService,
        private dotLoadingIndicatorService: DotLoadingIndicatorService
    ) {}

    ngOnInit(): void {
        this.dotRouterService.portletReload$.subscribe(this.changeSiteReload.bind(this));
        this.siteService.switchSite$.subscribe(this.changeSiteReload.bind(this));
        this.setIframeUrl();
        this.bindGlobalEvents();
    }

    /**
     * Tigger when the current site is changed, this method reload the iframe if is neccesary
     * @memberof IframePortletLegacyComponent
     */
    changeSiteReload(): void {
        if (this.urlItsNotBlank() && this.dotRouterService.currentPortlet.id !== 'sites') {
            this.dotLoadingIndicatorService.show();
            this.iframe.reload();
        }
    }

    private bindGlobalEvents(): void {
        const events: string[] = [
            'SAVE_FOLDER',
            'UPDATE_FOLDER',
            'DELETE_FOLDER',
            'SAVE_PAGE_ASSET',
            'UPDATE_PAGE_ASSET',
            'ARCHIVE_PAGE_ASSET',
            'UN_ARCHIVE_PAGE_ASSET',
            'DELETE_PAGE_ASSET',
            'PUBLISH_PAGE_ASSET',
            'UN_PUBLISH_PAGE_ASSET',
            'SAVE_FILE_ASSET',
            'UPDATE_FILE_ASSET',
            'ARCHIVE_FILE_ASSET',
            'UN_ARCHIVE_FILE_ASSET',
            'DELETE_FILE_ASSET',
            'PUBLISH_FILE_ASSET',
            'UN_PUBLISH_FILE_ASSET',
            'SAVE_LINK',
            'UPDATE_LINK',
            'ARCHIVE_LINK',
            'UN_ARCHIVE_LINK',
            'MOVE_LINK',
            'COPY_LINK',
            'DELETE_LINK',
            'PUBLISH_LINK',
            'UN_PUBLISH_LINK',
            'MOVE_FOLDER',
            'COPY_FOLDER',
            'MOVE_FILE_ASSET',
            'COPY_FILE_ASSET',
            'MOVE_PAGE_ASSET',
            'COPY_PAGE_ASSET'
        ];

        this.dotcmsEventsService.subscribeToEvents(events).subscribe(eventTypeWrapper => {
            if (this.dotRouterService.currentPortlet.id === 'site-browser') {
                this.loggerService.debug(
                    'Capturing Site Browser event',
                    eventTypeWrapper.eventType,
                    eventTypeWrapper.data
                );
                // TODO: When we finish the migration of the site browser this event will be handle.....
            }
        });
    }

    private setIframeUrl(): void {
        this.url = this.route.params
            .pluck('id')
            .map((id: string) => id)
            .withLatestFrom(this.route.url.map((urlSegment: UrlSegment[]) => urlSegment[0].path))
            .map(([id, url]) => {
                this.dotLoadingIndicatorService.show();
                return url === 'add'
                    ? this.contentletService.getUrlById(id)
                    : this.dotNavigationService.getUrlById(id);
            })
            .flatMap(res => res);
    }

    private urlItsNotBlank(): boolean {
        return (
            this.iframe.location.href !== 'about:blank' && this.iframe.location.pathname !== 'blank'
        );
    }
}
