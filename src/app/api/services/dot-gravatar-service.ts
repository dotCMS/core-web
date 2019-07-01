import { map, pluck, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import { Observable, of } from 'rxjs';

interface DotProfile {
    displayName: string;
    hash: string;
    id: string;
    name: string[];
    photos: {
        type: string;
        value: string;
    };
    preferredUsername: string;
    profileUrl: string;
    requestHash: string;
    thumbnailUrl: string;
    urls: string[];
}
@Injectable()
export class DotGravatarService {
    constructor(private jsonp: Jsonp) {}

    /**
     * Load the avatar url from a hash
     *
     * @param {string} hash
     * @returns {Observable<any>}
     * @memberof GravatarService
     */
    loadGravatarPhoto(hash: string): Observable<string> {
        return this.jsonp
            .get(`//www.gravatar.com/${hash}.json?callback=JSONP_CALLBACK`)
            .pipe(
                pluck('_body'),
                pluck('entry'),
                map((profiles: DotProfile[]) => profiles[0].photos[0].value),
                catchError(() => {
                    return of(null);
                })
            );
    }
}
