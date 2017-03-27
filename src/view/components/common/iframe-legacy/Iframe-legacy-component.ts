import {Component, ElementRef, ViewEncapsulation, ViewChild} from '@angular/core';
import {LoginService} from '../../../../api/services/login-service';
import {ActivatedRoute} from '@angular/router';
import {RoutingService} from '../../../../api/services/routing-service';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import {SiteChangeListener} from '../../../../api/util/site-change-listener';
import {SiteService} from '../../../../api/services/site-service';
import {DotcmsEventsService} from '../../../../api/services/dotcms-events-service';
import {MessageService} from '../../../../api/services/messages-service';
import {LoggerService} from '../../../../api/services/logger.service';
import {IframeOverlayService} from '../../../../api/services/iframe-overlay-service';

@Component({
    encapsulation: ViewEncapsulation.Emulated,
    moduleId: __moduleName, // REQUIRED to use relative path in styleUrls
    selector: 'dot-iframe',
    styleUrls: ['iframe-legacy-component.css'],
    templateUrl: ['iframe-legacy-component.html'],
    host: {
        '(window:resize)': 'resizeComponent($event)'
    }
})
export class IframeLegacyComponent extends SiteChangeListener {
    iframe: SafeResourceUrl;
    iframeElement;
    private loadingInProgress: boolean = true;
    private showOverlay: boolean = false;

    constructor(private route: ActivatedRoute, private routingService: RoutingService, private siteService: SiteService,
                private sanitizer: DomSanitizer, private element: ElementRef, private loginService: LoginService,
                private dotcmsEventsService: DotcmsEventsService, messageService: MessageService,
                private loggerService: LoggerService, private iframeOverlayService: IframeOverlayService) {
        super(siteService, ['ask-reload-page-message'], messageService);

        /**
         * Subscribe to the portletUrl$ changes to force the
         * reload of a portlet in the iframe legacy component
         * when the user click the subnav link and the user is on the
         * same portlet or other
         */
        routingService.portletUrl$.subscribe(url => {
            this.reloadIframePortlet(url);
        });

    }

    ngOnInit(): void {
        this.iframeOverlayService.overlay.subscribe(val => this.showOverlay = val);

        this.initComponent();

        let events: string[] = ['SAVE_FOLDER', 'UPDATE_FOLDER', 'DELETE_FOLDER', 'SAVE_PAGE_ASSET', 'UPDATE_PAGE_ASSET',
            'ARCHIVE_PAGE_ASSET', 'UN_ARCHIVE_PAGE_ASSET', 'DELETE_PAGE_ASSET', 'PUBLISH_PAGE_ASSET', 'UN_PUBLISH_PAGE_ASSET',
            'SAVE_FILE_ASSET', 'UPDATE_FILE_ASSET', 'ARCHIVE_FILE_ASSET', 'UN_ARCHIVE_FILE_ASSET', 'DELETE_FILE_ASSET',
            'PUBLISH_FILE_ASSET', 'UN_PUBLISH_FILE_ASSET', 'SAVE_LINK', 'UPDATE_LINK', 'ARCHIVE_LINK', 'UN_ARCHIVE_LINK',
            'MOVE_LINK', 'COPY_LINK', 'DELETE_LINK', 'PUBLISH_LINK', 'UN_PUBLISH_LINK', 'MOVE_FOLDER', 'COPY_FOLDER',
            'MOVE_FILE_ASSET', 'COPY_FILE_ASSET', 'MOVE_PAGE_ASSET', 'COPY_PAGE_ASSET'
        ];

        this.dotcmsEventsService.subscribeToEvents(events).subscribe( eventTypeWrapper => {
            if (this.routingService.currentPortletId === 'site-browser') {
                this.loggerService.debug('Capturing Site Browser event', eventTypeWrapper.eventType, eventTypeWrapper.data);
                // TODO: When we finish the migration of the site browser this event will be handle.....
            }
        });
    }

    ngAfterViewInit(): void {
        this.iframeElement = this.element.nativeElement.querySelector('iframe');
        this.resizeComponent();
    }

    private resizeComponent(): void {
        this.element.nativeElement.style.height = (window.innerHeight - 64) + 'px';
    }

    private reloadIframe(): void {
        this.loadingInProgress = true;
        this.iframeElement.contentWindow.location.reload();
    }

    private hideLoadingIndicator($event): void {
        this.loadingInProgress = false;
    }

    /**
     * Hide the loading indicator
     * @param $event
     */
    hideLoadingIndicator($event): void {
        this.loadingInProgress = false;
    }

    initComponent(): void {
        this.route.params.pluck<string>('id').subscribe(id => {
            this.iframe = this.loadURL(this.routingService.getPortletURL(id));
        });

        this.route.queryParams.pluck<string>('url').subscribe( url => {
            if (url) {
                this.iframe = this.loadURL(url);
            }
        } );
    }

    changeSiteReload(): void {
        if (!this.iframeElement) {
            this.iframeElement = this.element.nativeElement.querySelector('iframe');
        }

        if (this.iframeElement &&
            this.iframeElement.contentWindow &&
            this.iframeElement.contentWindow.location.href !== 'about:blank' && // For IE11
            this.iframeElement.contentWindow.location.origin !== 'null' &&
            this.routingService.currentPortletId !== 'sites') {
            this.reloadIframe();
        }
    }

    loadURL(url: string): SafeResourceUrl {
        let urlWithParameters = url;

        this.loadingInProgress = true;

        urlWithParameters += urlWithParameters.indexOf('?') === -1 ? '?' : '&';
        urlWithParameters += urlWithParameters.indexOf('in_frame') === -1 ? 'in_frame=true&frame=detailFrame&container=true' : '';

        return this.sanitizer.bypassSecurityTrustResourceUrl(urlWithParameters);
    }

    /**
     * Validate if the iframe window is send to the login page after jsessionid expired
     * then logout the user from angular session
     */
    checkSessionExpired(): void {
        if (this.iframeElement && this.iframeElement.contentWindow) {
            let currentPath = this.iframeElement.contentWindow.location.pathname;

            if (currentPath.indexOf('/c/portal_public/login') !== -1) {
                this.loginService.logOutUser().subscribe(data => {
                }, (error) => {
                    this.loggerService.error(error);
                });
            }
        }
    }

    /**
     * Force to reload the current iframe component portlet,
     * with the specified portlet url
     * @param url Url of the portlet to display
     */
    reloadIframePortlet(url: string): void {
        if (url !== undefined && url !== '') {
            let urlSplit = url.split('/');
            let id = urlSplit[urlSplit.length - 1];
            this.iframe = this.loadURL(this.routingService.getPortletURL(id));
        }
    }
}
