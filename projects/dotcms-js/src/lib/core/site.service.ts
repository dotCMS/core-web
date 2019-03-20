import { Injectable } from '@angular/core';
import { CoreWebService } from './core-web.service';
import { Observable, Subject, of, merge } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { pluck, map, take } from 'rxjs/operators';
import { LoginService, Auth } from './login.service';
import { LoggerService } from './logger.service';
import { DotcmsEventsService } from './dotcms-events.service';

/**
 * Provide methods and data to hable the sites.
 * @export
 */
@Injectable()
export class SiteService {
    private selectedSite: Site;
    private urls: any;
    private events: string[] = [
        'SAVE_SITE',
        'PUBLISH_SITE',
        'UPDATE_SITE_PERMISSIONS',
        'UN_ARCHIVE_SITE',
        'UPDATE_SITE',
        'ARCHIVE_SITE'
    ];
    private _switchSite$: Subject<Site> = new Subject<Site>();
    private _refreshSites$: Subject<Site> = new Subject<Site>();

    constructor(
        loginService: LoginService,
        dotcmsEventsService: DotcmsEventsService,
        private coreWebService: CoreWebService,
        private loggerService: LoggerService
    ) {
        this.urls = {
            currentSiteUrl: 'v1/site/currentSite',
            sitesUrl: 'v1/site',
            switchSiteUrl: 'v1/site/switch'
        };

        dotcmsEventsService.open().subscribe(() => this.switchSite(this.selectedSite));

        dotcmsEventsService
            .subscribeToEvents(['ARCHIVE_SITE', 'UPDATE_SITE'])
            .subscribe((data) => this.eventResponse(data));

        dotcmsEventsService
            .subscribeTo('SWITCH_SITE')
            .subscribe((event) => this.setCurrentSite(event.data));

        dotcmsEventsService
            .subscribeToEvents(this.events)
            .subscribe((data) => this.siteEventsHandler(data));

        loginService.watchUser((auth: Auth) => {
            if (!auth.isLoginAs) {
                this.loadCurrentSite();
            }
        });
    }

    /**
     * Manage the response when an event happen
     * @param void eventTypeWrapper
     * @returns *
     * @memberof SiteService
     */
    eventResponse(eventTypeWrapper): void {
        this.loggerService.debug(
            'Capturing Site event',
            eventTypeWrapper.eventType,
            eventTypeWrapper.data
        );
        // TODO the backend needs a change in the response 'data.data'.
        const siteIdentifier = eventTypeWrapper.data.data.identifier;
        if (siteIdentifier === this.selectedSite.identifier) {
            if (eventTypeWrapper.eventType !== 'ARCHIVE_SITE') {
                this.loadCurrentSite();
            }
        }
    }

    /**
     * Refresh the sites list if a event happen
     * @param any eventTypeWrapper
     * @memberof SiteService
     */
    siteEventsHandler(eventTypeWrapper): void {
        this._refreshSites$.next(eventTypeWrapper.data.data);
    }

    /**
     * Observable trigger when an site event happens
     * @readonly
     * @memberof SiteService
     */
    get refreshSites$(): Observable<Site> {
        return this._refreshSites$.asObservable();
    }

    /**
     * Observable tigger when the current site is changed
     * @readonly
     * @memberof SiteService
     */
    get switchSite$(): Observable<Site> {
        return this._switchSite$.asObservable();
    }

    /**
     * Return the current site for the login user.
     * @readonly
     * @memberof SiteService
     */
    get currentSite(): Site {
        return this.selectedSite;
    }

    /**
     * Switch To Default Site in the BE and returns it.
     *
     * @returns Observable<Site>
     * @memberof SiteService
     */
    switchToDefaultSite(): Observable<Site> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: 'v1/site/switch'
            })
            .pipe(pluck('entity'));
    }

    /**
     * Get a site by the id
     *
     * @param string id
     * @returns Observable<Site>
     * @memberof SiteService
     */
    getSiteById(id: string): Observable<Site> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `content/render/false/query/+contentType:host%20+identifier:${id}`
            })
            .pipe(
                pluck('contentlets'),
                map((sites: Site[]) => sites[0])
            );
    }

    /**
     * Change the current site
     * @param Site site
     * @memberof SiteService
     */
    switchSite(site: Site): void {
        this.loggerService.debug('Applying a Site Switch', site.identifier);

        this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `${this.urls.switchSiteUrl}/${site.identifier}`
            })
            .subscribe(() => this.setCurrentSite(site));
    }

    /**
     * Get the current site
     * @returns Observable<Site>
     * @memberof SiteService
     */
    getCurrentSite(): Observable<Site> {
        return merge(
            this.selectedSite ? of(this.selectedSite) : this.requestCurrentSite(),
            this.switchSite$
        );
    }

    private requestCurrentSite(): Observable<Site> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: this.urls.currentSiteUrl
            })
            .pipe(pluck('entity'));
    }

    private setCurrentSite(site: Site): void {
        if (this.selectedSite) {
            this._switchSite$.next({...site});
        }

        this.selectedSite = site;
    }

    private loadCurrentSite(): void {
        this.getCurrentSite().pipe(take(1)).subscribe((currentSite: Site) => {
            this.setCurrentSite(currentSite);
        });
    }
}

export interface Site {
    hostname: string;
    type: string;
    identifier: string;
}
