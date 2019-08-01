import { pluck } from 'rxjs/operators';
import { CoreWebService } from 'dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestMethod } from '@angular/http';
import { DotPageRender } from '@portlets/dot-edit-page/shared/models/dot-rendered-page.model';
import { PageMode } from '@portlets/dot-edit-page/shared/models/page-mode.enum';

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
            ...(options.mode ? { mode: this.getPageModeString(options.mode) } : {}),
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

    // tslint:disable-next-line:cyclomatic-complexity
    private getOptionalViewAsParams(viewAsConfig: DotPageRenderViewAsParams) {
        const options: any = {
            ...(viewAsConfig.persona_id
                ? { 'com.dotmarketing.persona.id': viewAsConfig.persona_id }
                : {}),
            ...(viewAsConfig.device_inode ? { device_inode: viewAsConfig.device_inode } : {})
        };

        if (viewAsConfig.language_id) {
            options.language_id = viewAsConfig.language_id;
        }

        return options;
    }

    private getPageModeString(pageMode: PageMode): string {
        const pageModeString = {};
        pageModeString[PageMode.EDIT] = 'EDIT_MODE';
        pageModeString[PageMode.PREVIEW] = 'PREVIEW_MODE';
        pageModeString[PageMode.LIVE] = 'ADMIN_MODE';

        return pageModeString[pageMode];
    }
}

export interface DotPageRenderOptions {
    url: string;
    mode?: PageMode;
    viewAs?: DotPageRenderViewAsParams;
}

interface DotPageRenderViewAsParams {
    persona_id?: string;
    language_id?: number;
    device_inode?: string;
}

interface DotPageRenderRequestParams {
    persona_id?: string;
    language_id?: string;
    device_inode?: string;
    mode: string;
}
