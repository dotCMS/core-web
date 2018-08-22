import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { take, filter, switchMap } from 'rxjs/operators';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { LoginService, Auth } from 'dotcms-js/dotcms-js';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Data, Router, NavigationEnd } from '@angular/router';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class CrumbTrailService {
    private BASE_PATH = '/dotAdmin/#';
    private URL_SEPARTOR = '/';
    private KEY_SEPARTOR = '-';
    private LEGACY_PORLET_PREFIX = 'c';

    private lastURL: string;
    private crumbTrail$:  BehaviorSubject<DotCrumbTrail> = new BehaviorSubject({
        crumbs: []
    });

    private activatedRoute$: ActivateRouteState;

    constructor(
        private dotMessageService: DotMessageService,
        private loginService: LoginService,
        private dotMenuService: DotMenuService,
        private router: Router
    ) {

        this.loginService.auth$
            .pipe(
                filter((auth: Auth) => !auth.user)
            )
            .subscribe(() => {
                this.clean();
            });

        this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            try {
                this.push(this.activatedRoute$.route, this.activatedRoute$.state);
            } catch (e) {
                // ignore
            }
        });
    }

    set activatedRoute(activatedRoute: ActivateRouteState) {
        this.activatedRoute$ = activatedRoute;
    }

    public clean(): void {
        this.crumbTrail$.next({
            crumbs: []
        });
    }

    get crumbTrail(): Observable<DotCrumbTrail> {
        return this.crumbTrail$.asObservable();
    }

    private push(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
        const absoluteUrl = this.removeQueryParams(this.getAbsoluteURL(state));

        if (this.lastURL === absoluteUrl) {
            return;
        }

        if (this.isPreviousCrumbTrail(absoluteUrl)) {
            this.comeBackTo(absoluteUrl);
        } else {
            this.pushRoute(route);
        }

        this.lastURL = absoluteUrl;
    }

    private removeQueryParams(url: string): string {
        const queryParamsIndex = url.indexOf('?');
        return queryParamsIndex === -1 ? url : url.substr(0, queryParamsIndex);
    }

    private isPreviousCrumbTrail(url: string): boolean {
        return this.crumbTrail$.getValue().crumbs.some(crumbTrail => crumbTrail.url === url);
    }

    private getAbsoluteURL(state: RouterStateSnapshot): string {
        return this.BASE_PATH + state.url;
    }

    private comeBackTo(url: string) {
        const crumbTrails: DotCrumbTrail = this.crumbTrail$.getValue();

        const index = crumbTrails.crumbs.findIndex(crumb => crumb.url === url);
        crumbTrails.crumbs.splice(index + 1);
        this.crumbTrail$.next(crumbTrails);
    }

    private pushRoute(route: ActivatedRouteSnapshot): void {

        const crumbsTrail = this.crumbTrail$.getValue();
        let crumbs: DotCrumb[] = this.crumbTrail$.getValue().crumbs;

        if (crumbs.length) {
            crumbs.push(this.getLastCrumb(route));
        } else {
            crumbs = this.getCrumbs(route);

            if (!crumbs.length) {
                throw new Error('Anything to push');
            }
        }

        this.setLabels(crumbs, route).subscribe(crumbTrailWithLabel => {
            crumbsTrail.crumbs = crumbTrailWithLabel;
            this.crumbTrail$.next(crumbsTrail);
        });
    }

    private getLastCrumb(route: ActivatedRouteSnapshot): DotCrumb {
        const crumbs = this.getCrumbs(route);
        const lastCrumb = crumbs.pop();

        if (this.lastURL.indexOf(lastCrumb.url) !== -1) {
            throw new Error('Url is already in trail');
        }
        return lastCrumb;
    }

    private setLabels(crumbs: DotCrumb[], route: ActivatedRouteSnapshot): Observable<DotCrumb[]> {

        return this.getMessages(crumbs).pipe(
            switchMap((messages: Messages) => {
                const crumbsTrail = this.crumbTrail$.getValue();
                crumbsTrail.parentMenuLabel = messages.parentMenuLabel;

                return Observable.of(
                            crumbs.map((crumb, index) => crumb.label ? crumb : {
                                ...crumb,
                                label: index === 0 ? messages.menuLabel : this.getLabel(crumb, messages.messages, route.data)
                            })
                        );
            }),
            take(1)
        );
    }

    private getMessages(crumbs: DotCrumb[]): Observable<Messages> {
        return forkJoin(
            this.dotMessageService.getMessages([
                ...crumbs.filter(crumb => !crumb.label).map(crumb => `crumbs.trail.${crumb.messageKey}`)
            ]),
            this.getPortletLabel(crumbs[0].messageKey, crumbs),
            this.getMenuLabel(crumbs[0].messageKey)
        ).pipe(
            switchMap((values) => Observable.of({
                messages: values[0],
                menuLabel: values[1],
                parentMenuLabel: values[2]
            })),
            take(1)
        );
    }

    private getMenuLabel(portletName: string): Observable<string> {
        const crumbsTrail = this.crumbTrail$.getValue();

        if (crumbsTrail.parentMenuLabel) {
            return Observable.of(crumbsTrail.parentMenuLabel);
        } else if (portletName.startsWith('edit-page')) {
            return this.dotMenuService.getDotMenu('site-browser')
                .map(dotMenu => dotMenu ? dotMenu.name : null);
        } else {
            return this.dotMenuService.getDotMenu(portletName)
                .map(dotMenu => dotMenu ? dotMenu.name : null);
        }
    }

    private getPortletLabel(portletName: string, crumbs: DotCrumb[]): Observable<string> {
        if (portletName.startsWith('edit-page')) {
            return this.dotMenuService.getDotMenuItem('site-browser')
                .map(dotMenuItem => {
                    crumbs.unshift({
                        messageKey: 'site-browser',
                        url: `${this.BASE_PATH}/c/site-browser`
                    });

                    return dotMenuItem.label;
                });
        } else {
            return this.dotMenuService.getDotMenuItem(portletName)
                .map(dotMenuItem => dotMenuItem ? dotMenuItem.label : this.getPrettyLabel(portletName));
        }
    }

    private getLabel(crumb: DotCrumb, messages: any, routeData: Data): string {
        const label = (messages[ `crumbs.trail.${crumb.messageKey}`] !==  `crumbs.trail.${crumb.messageKey}` ?
            messages[crumb.messageKey] :
            this.getPrettyLabel(crumb.messageKey));

        return  crumb.dataId ? `${label} ${this.getDataName(crumb, routeData)}` : label;
    }

    private getPrettyLabel(key: string) {
        return key.split('-')
            .map(keySplit => this.toFisrLetterUpper(keySplit))
            .join(' ');
    }

    private toFisrLetterUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    private getCrumbs(route: ActivatedRouteSnapshot): DotCrumb[] {
        let acumulatorURL = this.BASE_PATH;

        return this.getSegments(route)
            .map((segment: Segment) => {
                acumulatorURL += this.URL_SEPARTOR + this.getSegmentURL(segment);

                if (segment.paths[0].routeConfig.path === this.LEGACY_PORLET_PREFIX) {
                    return null;
                } else {
                    return {
                        messageKey: this.getMessageKey(segment.paths),
                        dataId: this.getDataId(segment.paths),
                        url: acumulatorURL,
                        queryParams: route.queryParams
                    };
                }
            })
            .filter(crumb => crumb);
    }

    private getSegmentURL(segment: Segment): string {
        return segment.paths
            .map(path => this.getKey(path))
            .join(this.URL_SEPARTOR);
    }

    private getSegments(route: ActivatedRouteSnapshot): Segment[] {
       const paths: ActivatedRouteSnapshot[] = route.pathFromRoot
            .filter((path: ActivatedRouteSnapshot) => path.routeConfig && path.routeConfig.path !== '' && !path.data.excludeFromCrumbTrail);

        const segments: Segment[] = [{
            paths: []
        }];

        paths.forEach(path => {
            if (path.routeConfig.loadChildren) {
                segments[segments.length - 1].paths.push(path);
            } else {
                segments.push({
                    paths: [path]
                });
            }
        });

        return segments.filter(segment => segment.paths.length);
    }

    private getDataName(crumbTrail: DotCrumb, routeData: Data): string {
        const dataId = crumbTrail.dataId;

        if (dataId) {
            const data = this.getData(routeData, dataId);
            return data ? data.name : '';
        } else {
            return null;
        }
    }

    private getData(data: any, dataId: string): any {
        for (const dataItem in data) {
            if (data[dataItem].id === dataId) {
                return data[dataItem];
            }
        }

        return null;
    }

    private getMessageKey(paths: ActivatedRouteSnapshot[]): string {
        return paths
            .map(path => this.getKey(path))
            .filter(key => key && key.length)
            .join(this.KEY_SEPARTOR);
    }

    private getKey(path: ActivatedRouteSnapshot): string {
        return path.routeConfig.path.split('/')
            .map(pathSplit => pathSplit.startsWith(':') ? path.params[pathSplit.substr(1)] : pathSplit)
            .filter(key => !this.isId(key))
            .join(this.KEY_SEPARTOR);
    }

    private getDataId(paths: ActivatedRouteSnapshot[]): string {
        return paths
            .map(path => path.routeConfig.path
                            .split('/')
                            .map((pathSplit, index) => pathSplit.startsWith(':') ? path.params[pathSplit.substr(1)] : pathSplit)
                            .find(key => this.isId(key))
            )
            .find(id => id);
    }

    private isId(value: string): boolean {
        return /\w+-\w+-\w+-\w+-\w+/.test(value);
    }
}

export interface DotCrumbTrail {
    crumbs:  DotCrumb[];
    parentMenuLabel?: string;
}

export interface DotCrumb {
    messageKey: string;
    dataId?: string;
    label?: string;
    url: string;
    queryParams?: {
        [k: string]: any;
    };
}

interface Messages {
    messages: any;
    menuLabel: string;
    parentMenuLabel: string;
}

interface ActivateRouteState {
    route: ActivatedRouteSnapshot;
    state: RouterStateSnapshot;
}

interface Segment {
    paths: ActivatedRouteSnapshot[];
}
