import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { SiteService, DotcmsEventsService, LoggerService } from 'dotcms-js/dotcms-js';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { DotRouterService } from '../../../../../api/services/dot-router-service';
import { DotContentletService } from '../../../../../api/services/dot-contentlet.service';
import { DotLoadingIndicatorService } from '../dot-loading-indicator/dot-loading-indicator.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'dot-iframe-porlet',
    templateUrl: 'iframe-porlet-legacy.component.html'
})
export class IframePortletLegacyComponent implements OnInit {
    @ViewChild('iframe') iframe;
    url: BehaviorSubject<string> = new BehaviorSubject('');
    isLoading = false;

    constructor(
        private contentletService: DotContentletService,
        private dotcmsEventsService: DotcmsEventsService,
        private dotLoadingIndicatorService: DotLoadingIndicatorService,
        private dotMenuService: DotMenuService,
        private dotRouterService: DotRouterService,
        private route: ActivatedRoute,
        public loggerService: LoggerService,
        public siteService: SiteService
    ) {}

    ngOnInit(): void {
        this.dotRouterService.portletReload$.subscribe(() => {
            this.reloadIframePortlet();
        });
        this.siteService.switchSite$.subscribe(() => {
            // prevent set empty URL - when the page first loads.
            if (this.url.getValue() !== '') {
                this.reloadIframePortlet();
            }
        });
        this.setIframeSrc();
        this.bindGlobalEvents();
    }

    /**
     * Tigger when the current site is changed, this method reload the iframe if is neccesary
     * @memberof IframePortletLegacyComponent
     */
    reloadIframePortlet(): void {
        this.dotLoadingIndicatorService.show();
        this.setUrl(this.url.getValue());
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

    private setIframeSrc(): void {
        // We use the query param to load a page in edit mode in the iframe
        const queryUrl$ = this.route.queryParams.pluck('url').map((url: string) => url);

        queryUrl$.subscribe((queryUrl: string) => {
            if (queryUrl) {
                this.setUrl(queryUrl);
            } else {
                this.setPortletUrl();
            }
        });
    }

    private setPortletUrl(): void {
        const portletId$ = this.route.params.pluck('id').map((id: string) => id);

        portletId$
            .withLatestFrom(this.route.parent.url.map((urlSegment: UrlSegment[]) => urlSegment[0].path))
            .flatMap(
                ([id, url]) =>
                    url === 'add' ? this.contentletService.getUrlById(id) : this.dotMenuService.getUrlById(id)
            )
            .subscribe((url: string) => {
                console.log(url);
                // url = 'http://localhost:8080/c/portal/layout?p_l_id=b7ab5d3c-5ee0-4195-a17e-8f5579d718dd&p_p_id=site-browser&p_p_action=1&p_p_state=maximized&p_p_mode=view&_site_browser_struts_action=%2Fext%2Fhtmlpages%2Fpreview_htmlpage&_site_browser_previewPage=1&inode=cc2cdf9c-a20d-4862-9454-2a76c1132123&referer=http://localhost:8080/c/portal/layout?p_l_id=b7ab5d3c-5ee0-4195-a17e-8f5579d718dd&p_p_id=site-browser&p_p_action=0&p_p_state=maximized&p_p_mode=view&_site_browser_struts_action=%2Fext%2Fbrowser%2Fview_browser&random=185348028';

                // original = "http://localhost:8080/c/portal/layout?p_l_id=b7ab5d3c-5ee0-4195-a17e-8f5579d718dd&p_p_id=site-browser&p_p_action=0&&dm_rlout=1&r=1512132122867"

                url += '&_site_browser_struts_action=%2Fext%2Fhtmlpages%2Fpreview_htmlpage';

                this.setUrl(url);
            });
    }

    /**
     * This function set isLoading to true, to remove the Legacy Iframe from the DOM while the src attribute is updated.
     * @param {string} nextUrl
     */
    private setUrl(nextUrl: string): void {
        this.dotLoadingIndicatorService.show();
        this.isLoading = true;
        this.url.next(nextUrl);
        // Need's this time to update the iFrame src.
        setTimeout(() => {
            this.isLoading = false;
        }, 0);
    }
}
