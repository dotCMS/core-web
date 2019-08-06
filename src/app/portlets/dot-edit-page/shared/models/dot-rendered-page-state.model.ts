import { DotPageRender } from './dot-rendered-page.model';
import { PageMode } from './page-mode.enum';
import { User } from 'dotcms-js';
import { DotPage } from './dot-page.model';
import { DotLayout } from './dot-layout.model';
import { DotTemplate } from './dot-template.model';
import { DotEditPageViewAs } from '@models/dot-edit-page-view-as/dot-edit-page-view-as.model';

interface DotPageState {
    locked?: boolean;
    lockedByAnotherUser?: boolean;
    mode: PageMode;
}

export class DotRenderedPageState {
    private _state: DotPageState;

    constructor(private _user: User, private dotRenderedPage: DotPageRender) {
        const locked = !!dotRenderedPage.page.lockedBy;
        const lockedByAnotherUser = locked ? dotRenderedPage.page.lockedBy !== _user.userId : false;


        this._state = {
            locked: locked,
            lockedByAnotherUser: lockedByAnotherUser,
            mode: dotRenderedPage.viewAs.mode
        };
    }

    get canCreateTemplate(): any {
        return this.dotRenderedPage.canCreateTemplate;
    }

    get containers(): any {
        return this.dotRenderedPage.containers;
    }

    get html(): string {
        return this.dotRenderedPage.page.rendered;
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

    get user(): User {
        return this._user;
    }

    set dotRenderedPageState(dotRenderedPageState: DotRenderedPageState) {
        this.dotRenderedPage = dotRenderedPageState;
    }
}
