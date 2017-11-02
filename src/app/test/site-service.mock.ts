import { Site } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';

export class SiteServiceMock {
    public mockSites: Site[] = [
        {
            hostname: 'demo.dotcms.com',
            identifier: '123-xyz-567-xxl',
            type: 'abc'
        },
        {
            hostname: 'hello.dotcms.com',
            identifier: '456-xyz-789-xxl',
            type: 'def'
        }
    ];

    getSiteById(): Site {
        return null;
    }

    paginateSites(filter: string, archived: boolean, page: number, count: number): Observable<Site[]> {
        return Observable.of(this.mockSites);
    }

    get loadedSites(): Site[] {
        return this.mockSites;
    }

    get refreshSites$(): Observable<Site> {
        return Observable.of(this.mockSites[0]);
    }

    get sites$(): Observable<Site[]> {
        return Observable.of(this.mockSites);
    }

    get sitesCounter$(): Observable<number>{
        return Observable.of(this.mockSites.length * 3);
    }

    get switchSite$(): Observable<Site> {
        return Observable.from(this.mockSites).first();
    }
}
