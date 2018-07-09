import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { DotRenderedPage } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page.model';
import { PageMode } from '../../../portlets/dot-edit-page/shared/models/page-mode.enum';
import { DotEditPageViewAs } from '../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotLanguage } from '../../../shared/models/dot-language/dot-language.model';

/**
 * Provide util methods to get a edit page html
 * @export
 * @class DotRenderHTMLService
 */
@Injectable()
export class DotRenderHTMLService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the page HTML in edit mode
     *
     * @param {string} url
     * @param {DotEditPageViewAs} viewAsConfig
     * @returns {Observable<DotRenderedPage>}
     * @memberof DotRenderHTMLService
     */
    getEdit(url: string, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        return this.get(
            {
                url: url,
                mode: PageMode.EDIT,
                viewAs: viewAsConfig
            }
        );
    }

    /**
     * Get the page HTML in preview mode
     *
     * @param {string} url
     * @param {DotEditPageViewAs} viewAsConfig
     * @returns {Observable<DotRenderedPage>}
     * @memberof DotRenderHTMLService
     */
    getPreview(url: string, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        return this.get(
            {
                url: url,
                mode: PageMode.PREVIEW,
                viewAs: viewAsConfig
            }
        );
    }

    /**
     * Get the page HTML in live mode
     *
     * @param {string} url
     * @param {DotEditPageViewAs} viewAsConfig
     * @returns {Observable<DotRenderedPage>}
     * @memberof DotRenderHTMLService
     */
    getLive(url: string, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        return this.get(
            {
                url: url,
                mode: PageMode.LIVE,
                viewAs: viewAsConfig
            }
        );
    }

    public get(options: DotRenderPageOptions): Observable<DotRenderedPage> {
        let params: any = options.mode ? { mode: this.getPageModeString(options.mode) } : {};

        params = {
            ...params,
            ...options.viewAs ? this.getViewAsParameters(options) : {}
        };

        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/page/render/${options.url.replace(/^\//, '')}`,
                params: params
            })
            .pluck('entity');
    }

    private getViewAsParameters(options: DotRenderPageOptions) {
        if (typeof options.viewAs.language === 'string') {
            return {
                language_id: options.viewAs.language
            };
        } else {
            return this.setOptionalViewAsParams(options.viewAs);
        }
    }

    private setOptionalViewAsParams(viewAsConfig: DotEditPageViewAs) {
        console.log('viewAsConfig', viewAsConfig);
        return {
            language_id: (<DotLanguage> viewAsConfig.language).id,
            ...viewAsConfig.persona ? { 'com.dotmarketing.persona.id': viewAsConfig.persona.identifier } : {},
            ...viewAsConfig.device ? { 'device_inode': viewAsConfig.device.inode } : {}
        };
    }

    private getPageModeString(pageMode: PageMode): string {
        const pageModeString = {};
        pageModeString[PageMode.EDIT] = 'EDIT_MODE';
        pageModeString[PageMode.PREVIEW] = 'PREVIEW_MODE';
        pageModeString[PageMode.LIVE] = 'ADMIN_MODE';

        return pageModeString[pageMode];
    }
}

export interface DotRenderPageOptions {
    url: string;
    mode?: PageMode;
    viewAs?: DotEditPageViewAs;
}
