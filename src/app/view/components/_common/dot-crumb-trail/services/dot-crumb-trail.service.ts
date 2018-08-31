import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { take, switchMap } from 'rxjs/operators';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { ActivatedRouteSnapshot, Data, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class CrumbTrailService {
    private BASE_PATH = '/dotAdmin/#';
    private URL_SEPARTOR = '/';
    private KEY_SEPARTOR = '-';
    private LEGACY_PORLET_PREFIX = 'c';

    private crumbTrail$:  BehaviorSubject<DotCrumbTrail> = new BehaviorSubject({
        crumbs: []
    });

    private activatedRoute$: ActivatedRouteSnapshot;

    constructor(
        private dotMessageService: DotMessageService,
        private dotMenuService: DotMenuService,
        private router: Router
    ) {
        this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            this.push(this.activatedRoute$);
        });
    }

    set activatedRoute(activatedRoute: ActivatedRouteSnapshot) {
        this.activatedRoute$ = activatedRoute;
    }

    get crumbTrail(): Observable<DotCrumbTrail> {
        return this.crumbTrail$.asObservable();
    }

    private push(route: ActivatedRouteSnapshot): void {

        const crumbs = this.getCrumbs(route);

        this.setLabels(crumbs, route).subscribe(crumbTrailWithLabel => {
            this.crumbTrail$.next(crumbTrailWithLabel);
        });
    }

    private setLabels(crumbs: DotCrumb[], route: ActivatedRouteSnapshot): Observable<DotCrumbTrail> {

        return this.getMessages(crumbs).pipe(
            switchMap((messages: Messages) => {

                return Observable.of(
                    {
                        crumbs: crumbs.map((crumb, index) => crumb.label ? crumb : {
                                ...crumb,
                                label: index === 0 ? messages.menuLabel : this.getLabel(crumb, messages.messages, route.data)
                            }),
                        parentMenuLabel: messages.parentMenuLabel
                    }
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
        return this.dotMenuService.getDotMenu(portletName.startsWith('edit-page') ? 'site-browser' : portletName)
                    .map(dotMenu => dotMenu ? dotMenu.name : null);
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
            .map(path => this.getUrlSplit(path))
            .join(this.URL_SEPARTOR);
    }

    private getSegments(route: ActivatedRouteSnapshot): Segment[] {
       const paths: ActivatedRouteSnapshot[] = route.pathFromRoot
            .filter((path: ActivatedRouteSnapshot) => path.routeConfig && path.routeConfig.path !== '' && !path.data.excludeCrumbTrail);
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

    private getUrlSplit(path: ActivatedRouteSnapshot): string {
        return path.routeConfig.path.split('/')
            .map(pathSplit => pathSplit.startsWith(':') ? path.params[pathSplit.substr(1)] : pathSplit)
            .join(this.URL_SEPARTOR);
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

interface Segment {
    paths: ActivatedRouteSnapshot[];
}
