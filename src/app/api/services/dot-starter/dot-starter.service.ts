import { Injectable } from '@angular/core';
import { CoreWebService } from 'dotcms-js';

@Injectable()
export class DotStarterService {
    constructor(private coreWebService: CoreWebService) {}

    hide(): any {
        return this.coreWebService.requestView({
            url: 'api/v1/toolgroups/gettingstarted/_removefromcurrentuser',
            method: 'PUT'
        });
    }

    show(): any {
        return this.coreWebService.requestView({
            url: 'api/v1/toolgroups/gettingstarted/_addtocurrentuser',
            method: 'PUT'
        });
    }
}
