import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { DotTheme } from '../../../portlets/dot-edit-page/shared/models/dot-theme.model';
import { RequestMethod } from '@angular/http';

/**
 * Provide util methods to get themes information.
 * @export
 * @class DotThemesService
 */
@Injectable()
export class DotThemesService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get Theme information based on the inode.
     *
     * @param {string} inode
     * @returns {Observable<DotTheme[]>}
     * @memberof DotThemesService
     */
    get(inode: string): Observable<DotTheme> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'v1/themes/id/' + inode
            })
            .pluck('entity')
            .map((themes: DotTheme[]) => themes[0]);
    }
}
