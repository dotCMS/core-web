import { Injectable } from '@angular/core';
import { CoreWebService } from '@dotcms/dotcms-js';
import { Observable } from 'rxjs';
import { DotCMSContentlet } from '@dotcms/dotcms-models';
import { pluck, take } from 'rxjs/operators';

@Injectable()
export class DotVersionableService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Bring specific version of a content based on the inode.
     *
     * @param string inode
     * @returns Observable<DotCMSContentlet>
     * @memberof DotVersionableService
     */
    bringBack(inode: string): Observable<DotCMSContentlet> {
        return this.coreWebService
            .requestView({
                method: 'PUT',
                url: `/api/v1/versionables/${inode}/_bringback`
            })
            .pipe(take(1), pluck('entity'));
    }
}
