import { DotRenderedPage } from './dot-rendered-page.model';
import { PageMode } from './page-mode.enum';
import { User } from 'dotcms-js/dotcms-js';
import { DotPage } from './dot-page.model';
import { DotLayout } from './dot-layout.model';
import { DotTemplate } from './dot-template.model';
import { DotEditPageViewAs } from '../../../../shared/models/dot-edit-page-view-as/dot-edit-page-view-as.model';

export interface DotPageState {
    locked?: boolean;
    lockedByAnotherUser?: boolean;
    mode: PageMode;
}

interface LockedState {
    locked?: boolean;
    lockedByAnotherUser?: boolean;
}

export class DotRenderedPageState {
    private _state: DotPageState;

    constructor(private user: User, private dotRenderedPage: DotRenderedPage, mode?: PageMode) {
        const locked = !!dotRenderedPage.page.lockedBy;
        const lockedByAnotherUser = locked ? dotRenderedPage.page.lockedBy !== this.user.userId : false;

        this._state = {
            locked: locked,
            lockedByAnotherUser: lockedByAnotherUser,
            mode: mode || this.getDefaultMode(lockedByAnotherUser, dotRenderedPage.page, locked)
        };
    }

    get canCreateTemplate(): any {
        return this.dotRenderedPage.canCreateTemplate;
    }

    get containers(): any {
        return this.dotRenderedPage.containers;
    }

    get html(): string {
        return this.dotRenderedPage.html;
    }

    get layout(): DotLayout {
        return this.dotRenderedPage.layout;
    }

    get page(): DotPage {
        return this.dotRenderedPage.page;
    }

    get state(): DotPageState {
        return this._state;
    }

    get template(): DotTemplate {
        return this.dotRenderedPage.template;
    }

    get viewAs(): DotEditPageViewAs {
        return this.dotRenderedPage.viewAs;
    }

    set dotRenderedPageState(dotRenderedPageState: DotRenderedPageState) {
        this.dotRenderedPage = dotRenderedPageState;
    }

    private getPageMode(page: DotPage, locked: boolean): PageMode {
        return locked && page.canLock ? PageMode.EDIT : PageMode.PREVIEW;
    }

    private getDefaultMode(lockedByAnotherUser: boolean, page: DotPage, locked: boolean): PageMode {
        return lockedByAnotherUser ? PageMode.PREVIEW : this.getPageMode(page, locked);
    }
}
