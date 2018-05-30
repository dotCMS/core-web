import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Observable } from 'rxjs/Observable';
import { DotTheme } from '../../../portlets/dot-edit-page/shared/models/dot-theme.model';
import { RequestMethod } from '@angular/http';

@Injectable()
export class DotThemesService {
    constructor(private coreWebService: CoreWebService) {}

    get(inode?: string): Observable<DotTheme[]> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: 'v1/themes',
                params: { inode: inode ? inode : '' }
            })
            .pluck('entity');
    }
}
