import {pluck, map, withLatestFrom, mergeMap, takeUntil} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import {BehaviorSubject, Subject} from 'rxjs';

import { SiteService, DotcmsEventsService, LoggerService, DotEventTypeWrapper } from 'dotcms-js';

import { DotLoadingIndicatorService } from '../dot-loading-indicator/dot-loading-indicator.service';
import { DotMenuService } from '@services/dot-menu.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotIframeEventsHandler } from './services/iframe-events-handler.service';
import { DotContentTypeService } from '@services/dot-content-type/dot-content-type.service';

@Component({
    selector: 'dot-iframe-porlet',
    styleUrls: ['./iframe-porlet-legacy.component.scss'],
    templateUrl: 'iframe-porlet-legacy.component.html'
})
export class IframePortletLegacyComponent implements OnInit, OnDestroy {
    url: BehaviorSubject<string> = new BehaviorSubject('');
    isLoading = false;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private contentletService: DotContentTypeService,
        private dotLoadingIndicatorService: DotLoadingIndicatorService,
        private dotMenuService: DotMenuService,
        private dotRouterService: DotRouterService,
        private dotcmsEventsService: DotcmsEventsService,
        private route: ActivatedRoute,
        private dotIframeEventsHandler: DotIframeEventsHandler,
        public loggerService: LoggerService,
        public siteService: SiteService
    ) {}

    ngOnInit(): void {
        this.dotRouterService.portletReload$.subscribe((portletId: string) => {
            if (this.dotRouterService.isJSPPortlet()) {
                this.reloadIframePortlet(portletId);
            }
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

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Handle the custom events emmited by the iframe
     *
     * @param any $event
     * @memberof IframePortletLegacyComponent
     */
    onCustomEvent($event: CustomEvent): void {
        this.dotIframeEventsHandler.handle($event);
    }

    /**
     * Tigger when the current site is changed, this method reload the iframe if is neccesary
     * @memberof IframePortletLegacyComponent
     */
    reloadIframePortlet(portletId?: string): void {
        this.dotLoadingIndicatorService.show();
        if (portletId) {
            this.dotMenuService.getUrlById(portletId).subscribe((url: string) => {
                this.setUrl(url);
            });
        } else {
            this.setUrl(this.url.getValue());
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

        this.dotcmsEventsService
            .subscribeToEvents<any>(events)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: DotEventTypeWrapper<any>) => {
                if (this.dotRouterService.currentPortlet.id === 'site-browser') {
                    this.loggerService.debug(
                        'Capturing Site Browser event',
                        event.name,
                        event.data
                    );
                    // TODO: When we finish the migration of the site browser this event will be handle.....
                }
            });

        this.dotcmsEventsService
            .subscribeToEvents<any>(['DELETE_BUNDLE'])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.dotRouterService.currentPortlet.id === 'publishing-queue') {
                    this.reloadIframePortlet();
                }
            });
    }

    private setIframeSrc(): void {
        // We use the query param to load a page in edit mode in the iframe
        const queryUrl$ = this.route.queryParams.pipe(
            pluck('url'),
            map((url: string) => url)
        );

        queryUrl$.subscribe((queryUrl: string) => {
            if (queryUrl) {
                this.setUrl(queryUrl);
            } else {
                this.setPortletUrl();
            }
        });
    }

    private setPortletUrl(): void {
        const portletId$ = this.route.params.pipe(
            pluck('id'),
            map((id: string) => id)
        );

        portletId$
            .pipe(
                withLatestFrom(
                    this.route.parent.url.pipe(
                        map((urlSegment: UrlSegment[]) => urlSegment[0].path)
                    )
                ),
                mergeMap(([id, url]) =>
                    url === 'add'
                        ? this.contentletService.getUrlById(id)
                        : this.dotMenuService.getUrlById(id)
                )
            )
            .subscribe((url: string) => {
                this.setUrl(url);
            });
    }

    /**
     * This function set isLoading to true, to remove the Legacy Iframe from the DOM while the src attribute is updated.
     * @param string nextUrl
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
