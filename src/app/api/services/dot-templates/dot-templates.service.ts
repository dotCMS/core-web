import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';
import { pluck } from 'rxjs/operators';

@Injectable()
export class DotTemplatesService {
    constructor(private coreWebService: CoreWebService) {}

    getByInode(inode: string) {
        const url = `/api/v1/templates/${inode}`;
        return this.coreWebService
            .requestView({
                url
            })
            .pipe(pluck('entity'));
    }
}
