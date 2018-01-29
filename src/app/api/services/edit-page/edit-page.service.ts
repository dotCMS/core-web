import { CoreWebService } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { DotRenderedPage } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page.model';
import { PageMode } from '../../../portlets/dot-edit-content/components/dot-edit-page-toolbar/dot-edit-page-toolbar.component';
import { DotEditPageState } from '../../../shared/models/dot-edit-page-state/dot-edit-page-state.model';
import { DotRenderedPageState } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';

/**
 * Provide util methods to get a edit page html
 * @export
 * @class EditPageService
 */

@Injectable()
export class EditPageService {
    constructor(private coreWebService: CoreWebService) {}

    /**
     * Get the page HTML in edit mode
     *
     * @param {string} url
     * @returns {Observable<DotRenderedPage>}
     * @memberof EditPageService
     */
    getEdit(url: string): Observable<DotRenderedPage> {
        return this.get(url, 'EDIT_MODE');
    }

    /**
     * Get the page HTML in preview mode
     *
     * @param {string} url
     * @returns {Observable<DotRenderedPage>}
     * @memberof EditPageService
     */
    getPreview(url: string): Observable<DotRenderedPage> {
        return this.get(url, 'PREVIEW_MODE');
    }

    /**
     * Get the page HTML in live mode
     *
     * @param {string} url
     * @returns {Observable<DotRenderedPage>}
     * @memberof EditPageService
     */
    getLive(url: string): Observable<DotRenderedPage> {
        return this.get(url, 'LIVE_MODE');
    }

    /**
     * Lock a content asset
     *
     * @param {string} inode
     * @returns {Observable<any>}
     * @memberof PageViewService
     */
    lock(inode: string): Observable<any> {
        return this.coreWebService.requestView({
            method: RequestMethod.Put,
            url: `content/lock/inode/${inode}`
        });
    }

    /**
     * Unlock a content asset
     *
     * @param {string} inode
     * @returns {Observable<any>}
     * @memberof PageViewService
     */
    unlock(inode: string): Observable<any> {
        return this.coreWebService.requestView({
            method: RequestMethod.Put,
            url: `content/unlock/inode/${inode}`
        });
    }

    /**
     * Set the page state
     *
     * @param {DotRenderedPage} page
     * @param {DotEditPageState} state
     * @returns {Observable<any>}
     * @memberof EditPageService
     */
    setPageState(page: DotRenderedPage, state: DotEditPageState): Observable<DotRenderedPageState> {

        const methods = [];
        let lockUnlock;
        let pageMode;

        // When lock prop is not set is null
        if (state.lock === true) {
            lockUnlock = this.lock(page.liveInode)
                .pluck('bodyJsonObject')
                .pluck('message');
        } else if (state.lock === false) {
            lockUnlock = this.unlock(page.liveInode)
                .pluck('bodyJsonObject')
                .pluck('message');

        }

        if (state.mode === PageMode.PREVIEW) {
            pageMode = this.getPreview(page.pageUri);
        } else if (state.mode === PageMode.EDIT) {
            pageMode = this.getEdit(page.pageUri);
        } else if (state.mode === PageMode.LIVE) {
            pageMode = this.getPreview(page.pageUri);
        }

        if (lockUnlock && pageMode) {
            return lockUnlock.mergeMap((lockState: string) => {
                return pageMode.map((dotRenderedPage: DotRenderedPage) => {
                    return {
                        dotRenderedPage: dotRenderedPage,
                        lockState: lockState
                     };
                });
            });
        } else if (lockUnlock) {
            return lockUnlock.map((lockState: string) => {
                return {
                    lockState: lockState
                };
            });
        } else if (pageMode) {
            return pageMode.map((dotRenderedPage: DotRenderedPage) => {
                return {
                    dotRenderedPage: dotRenderedPage
                };
            });
        }
    }

    private get(url: string, mode: string): Observable<DotRenderedPage> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/page/renderHTML/${url.replace(/^\//, '')}?mode=${mode}`
            })
            .pluck('bodyJsonObject')
            .map((dotRenderedPage: DotRenderedPage) => {
                return {
                    ...dotRenderedPage,
                    locked: !!dotRenderedPage.lockedBy
                };
            });
    }
}
