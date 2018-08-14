import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { take, filter } from 'rxjs/operators';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { LoginService, Auth } from 'dotcms-js/dotcms-js';

@Injectable()
export class CrumbTrailService {
    private BASE_PATH = '/dotAdmin/#';
    private URL_SEPARTOR = '/';
    private crumbTrails$:  BehaviorSubject<CrumbTrail[]> = new BehaviorSubject([]);
    private lastUrl: string;

    constructor(private dotMessageService: DotMessageService, private loginService: LoginService) {
        this.loginService.auth$
            .pipe(
                filter((auth: Auth) => !auth.user)
            )
            .subscribe(() => {
                console.log('logout');
                this.clean();
            });
    }

    public push(url: string, label?: string): void {

        if (this.lastUrl !== url) {
            if (this.isPreviousCrumbTrail(url)) {
                this.comeBackTo(url);
            } else {
                this.pushNewCrumbTrail(url, label);
            }

            this.lastUrl = url;
        }
    }

    public clean(url?: string, label?: string): void {
        if (url) {
            const crumbTrails: CrumbTrail[] = this.crumbTrails$.getValue();
            crumbTrails.splice(0, crumbTrails.length);

            this.push(url, label);
        } else {
            this.crumbTrails$.next([]);
        }
    }

    get crumbTrails(): Observable<CrumbTrail[]> {
        return this.crumbTrails$.asObservable();
    }

    private comeBackTo(url: string) {
        const crumbTrails: CrumbTrail[] = this.crumbTrails$.getValue();
        const index = crumbTrails.findIndex(crumbTrail => crumbTrail.url === this.BASE_PATH + url);

        crumbTrails.splice(index + 1);

        this.crumbTrails$.next(crumbTrails);
    }

    private isPreviousCrumbTrail(url: string): boolean {
        return this.crumbTrails$.getValue().some(crumbTrail => crumbTrail.url === this.BASE_PATH + url);
    }

    private pushNewCrumbTrail(url: string, label?: string): void {
        const urlSplit: string[] = this.splitURL(url);

        if (!label) {
            this.dotMessageService.getMessages([
                ...urlSplit,
                urlSplit.join('-')
            ]).pipe(
                take(1)
            ).subscribe(messages => this.pushCrumbTrails(url, this.getLabel(messages, urlSplit)));
        } else {
            this.pushCrumbTrails(url, label);
        }
    }

    private pushCrumbTrails(url: string, label: string): void {
        const crumbTrails: CrumbTrail[] = this.crumbTrails$.getValue();

        crumbTrails.push({
            label: label,
            url: url.startsWith('/') ? this.BASE_PATH + url : url
        });

        this.crumbTrails$.next(crumbTrails);
        this.lastUrl = url;
    }

    private getDisjoinFromLastURL(url: string): string {
        if (this.lastUrl) {
            const indexOf: number = url.indexOf(this.lastUrl);
            return indexOf === -1 ? url : url.substr(indexOf + this.lastUrl.length);
        } else {
            return url;
        }
    }

    private getLabel(messages: any, urlSplit: string[]): string {
        const defaultKey = urlSplit.join('-');

        if (messages[defaultKey] && messages[defaultKey] !== defaultKey) {
            return messages[defaultKey];
        } else {
            return urlSplit.map(value => messages[value] && messages[value] !== value ?
                messages[value] : this.getPrettyLabel(value)).join(' ');
        }
    }

    private getPrettyLabel(key: string): string {
        return key.split('-')
            .map(keySplit => this.toFisrLetterUpper(keySplit))
            .join(' ');
    }

    private toFisrLetterUpper(value: string): string {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    private splitURL(url: string): string[] {
        const cleanUrl = this.removeQueryParams(url);
        const startIndex = cleanUrl.startsWith(this.URL_SEPARTOR) ? 1 : -1;
        return this.getDisjoinFromLastURL(cleanUrl)
                .split(this.URL_SEPARTOR)
                .filter(((split, index) => (split !== 'c' || index !== startIndex) && split.length > 0));
    }

    private removeQueryParams(url: string) {
        const startQueryParams = url.indexOf('?');
        return startQueryParams === -1 ? url : url.substr(0, startQueryParams);
    }
}

export interface CrumbTrail {
    label: string;
    url: string;
}
