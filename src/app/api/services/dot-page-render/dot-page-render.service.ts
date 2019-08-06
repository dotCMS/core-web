import { pluck } from 'rxjs/operators';
import { CoreWebService } from 'dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotPageRender } from '@portlets/dot-edit-page/shared/models/dot-rendered-page.model';
import { PageMode } from '@portlets/dot-edit-page/shared/models/page-mode.enum';
import { DotPersona } from '@shared/models/dot-persona/dot-persona.model';
import { DotDevice } from '@shared/models/dot-device/dot-device.model';

/**
 * Get a render page with the received params
 *
 * @export
 * @class DotPageRenderService
 */
@Injectable()
export class DotPageRenderService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Make request to get a rendered page
     *
     * @param {DotPageRenderOptions} options
     * @returns {Observable<DotPageRender>}
     * @memberof DotPageRenderService
     */
    get(options: DotPageRenderOptions): Observable<DotPageRender> {
        const params: DotPageRenderRequestParams = {
            ...(options.viewAs ? this.getOptionalViewAsParams(options.viewAs) : {})
        };

        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/page/render/${options.url.replace(/^\//, '')}`,
                params: params
            })
            .pipe(pluck('entity'));
    }

    // REVISIT THIS METHOD
    // tslint:disable-next-line:cyclomatic-complexity
    private getOptionalViewAsParams(viewAsConfig: DotPageRenderOptionsViewAs) {
        const personaIdentifier = viewAsConfig.persona && viewAsConfig.persona.identifier;
        const deviceInode = viewAsConfig.device && viewAsConfig.device.inode;

        const options: any = {
            ...(personaIdentifier ? { 'com.dotmarketing.persona.id': personaIdentifier } : {}),
            ...(deviceInode ? { device_inode: deviceInode } : {})
        };

        if (viewAsConfig.language) {
            options.language_id = viewAsConfig.language;
        }

        return options;
    }
}

export interface DotPageRenderOptionsViewAs {
    persona?: DotPersona;
    language?: number;
    device?: DotDevice;
}

export interface DotPageRenderOptions {
    url?: string;
    mode?: PageMode;
    viewAs?: DotPageRenderOptionsViewAs;
}

interface DotPageRenderRequestParams {
    persona_id?: string;
    language_id?: string;
    device_inode?: string;
    mode: string;
}
