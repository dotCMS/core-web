import { CoreWebService, LoginService } from 'dotcms-js/dotcms-js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestMethod } from '@angular/http';
import { DotRenderedPage } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page.model';
import { DotEditPageState } from '../../../shared/models/dot-edit-page-state/dot-edit-page-state.model';
import { DotRenderedPageState } from '../../../portlets/dot-edit-page/shared/models/dot-rendered-page-state.model';
import { PageMode } from '../../../portlets/dot-edit-page/content/shared/page-mode.enum';
import { DotEditPageViewAs } from '../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';

/**
 * Provide util methods to get a edit page html
 * @export
 * @class EditPageService
 */

@Injectable()
export class EditPageService {
    constructor(private coreWebService: CoreWebService, private loginService: LoginService) {}

    /**
     * Get the page HTML in edit mode
     *
     * @param {string} url {DotEditPageViewAs} viewAsConfig
     * @returns {Observable<DotRenderedPage>}
     * @memberof EditPageService
     */
    getEdit(url: string, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        return this.get(url, PageMode.EDIT, viewAsConfig);
    }

    /**
     * Get the page HTML in preview mode
     *
     * @param {string} url {DotEditPageViewAs} viewAsConfig
     * @returns {Observable<DotRenderedPage>}
     * @memberof EditPageService
     */
    getPreview(url: string, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        return this.get(url, PageMode.PREVIEW, viewAsConfig);
    }

    /**
     * Get the page HTML in live mode
     *
     * @param {string} url {DotEditPageViewAs} viewAsConfig
     * @returns {Observable<DotRenderedPage>}
     * @memberof EditPageService
     */
    getLive(url: string, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        return this.get(url, PageMode.LIVE, viewAsConfig);
    }

    /**
     * Lock a content asset
     *
     * @param {string} inode
     * @returns {Observable<any>}
     * @memberof PageViewService
     */
    lock(inode: string): Observable<any> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `content/lock/inode/${inode}`
            })
            .pluck('bodyJsonObject');
    }

    /**
     * Unlock a content asset
     *
     * @param {string} inode
     * @returns {Observable<any>}
     * @memberof PageViewService
     */
    unlock(inode: string): Observable<any> {
        return this.coreWebService
            .requestView({
                method: RequestMethod.Put,
                url: `content/unlock/inode/${inode}`
            })
            .pluck('bodyJsonObject');
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
        const lockUnlock: Observable<string> = this.getLockMode(page.liveInode, state.locked);
        const pageMode: Observable<DotRenderedPage> =
            state.mode !== undefined ? this.getPageModeMethod(state.mode)(page.pageURI) : null;

        /*
            TODO: we need a refactor to add the mode to the interface: DotRenderedPageState, the idea is to keep the page object from
            the server pristine and create a new object to hanlde the UI of the page.
        */
        return this.getStateRequest(lockUnlock, pageMode).map((dotRenderedPageState: DotRenderedPageState) => {
            if (state.mode) {
                dotRenderedPageState.dotRenderedPage.mode = state.mode;
            }
            if (state.locked) {
                dotRenderedPageState.dotRenderedPage.locked = state.locked;
            }

            return dotRenderedPageState;
        });
    }

    /**
     * Set the mode of the request to refresh the page
     *
     * @param {PageMode} mode
     * @returns {(string) => Observable<DotRenderedPage>}
     */
    getPageModeMethod(mode: PageMode): (string, DotEditPageViewAs?) => Observable<DotRenderedPage> {
        const map = {};
        map[PageMode.PREVIEW] = (url: string, viewAsConfig?: DotEditPageViewAs) => this.getPreview(url, viewAsConfig);
        map[PageMode.EDIT] = (url: string, viewAsConfig?: DotEditPageViewAs) => this.getEdit(url, viewAsConfig);
        map[PageMode.LIVE] = (url: string, viewAsConfig?: DotEditPageViewAs) => this.getLive(url, viewAsConfig);

        return map[mode];
    }

    private get(url: string, pageMode: PageMode, viewAsConfig?: DotEditPageViewAs): Observable<DotRenderedPage> {
        let params = { mode: this.getPageModeString(pageMode) };
        if (viewAsConfig) {
            params = Object.assign(params, {
                language_id: viewAsConfig.language.id,
                'com.dotmarketing.persona.id': viewAsConfig.persona.identifier
            });
        }
        return this.coreWebService
            .requestView({
                method: RequestMethod.Get,
                url: `v1/page/renderHTML/${url.replace(/^\//, '')}`,
                params: params
            })
            .pluck('bodyJsonObject')
            .map((page: DotRenderedPage) => this.getPageWithExtraProperties(page));
    }

    private getLockMode(liveInode: string, lock: boolean): Observable<string> {
        if (lock === true) {
            return this.lock(liveInode).pluck('message');
        } else if (lock === false) {
            return this.unlock(liveInode).pluck('message');
        }

        return null;
    }

    private getPageMode(page: DotRenderedPage): PageMode {
        return page.locked && page.canLock ? PageMode.EDIT : PageMode.PREVIEW;
    }

    private getStateRequest(
        lockUnlock: Observable<string>,
        pageMode: Observable<DotRenderedPage>
    ): Observable<DotRenderedPageState> {
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

    private getPageModeString(pageMode: PageMode): string {
        const pageModeString = {};
        pageModeString[PageMode.EDIT] = 'EDIT_MODE';
        pageModeString[PageMode.PREVIEW] = 'PREVIEW_MODE';
        pageModeString[PageMode.LIVE] = 'LIVE';

        return pageModeString[pageMode];
    }

    private getPageWithExtraProperties(page: DotRenderedPage): DotRenderedPage {
        const locked = !!page.lockedBy;
        const lockedByAnotherUser = locked ? page.lockedBy !== this.loginService.auth.user.userId : false;

        page = {
            ...page,
            locked,
            lockedByAnotherUser
        };

        const mode: PageMode = page.lockedByAnotherUser ? PageMode.PREVIEW : this.getPageMode(page);

        return {
            ...page,
            mode
        };
    }
}
