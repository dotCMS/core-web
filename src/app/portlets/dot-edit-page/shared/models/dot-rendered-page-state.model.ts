import { DotPageRender } from './dot-rendered-page.model';
import { DotPageMode } from './dot-page-mode.enum';
import { User } from 'dotcms-js';
import { DotPage } from './dot-page.model';
import { DotLayout } from './dot-layout.model';
import { DotTemplate } from './dot-template.model';
import { DotEditPageViewAs } from '@models/dot-edit-page-view-as/dot-edit-page-view-as.model';
import { DotLayoutColumn } from './dot-layout-column.model';
import { DotPageContainer } from '.';

interface DotPageState {
    locked?: boolean;
    lockedByAnotherUser?: boolean;
    mode: DotPageMode;
    haveContent: boolean;
}

export class DotRenderedPageState {
    private _state: DotPageState;

    constructor(private _user: User, private dotRenderedPage: DotPageRender) {
        const locked = !!dotRenderedPage.page.lockedBy;
        const lockedByAnotherUser = locked ? dotRenderedPage.page.lockedBy !== _user.userId : false;

        this._state = {
            locked: locked,
            lockedByAnotherUser: lockedByAnotherUser,
            mode: dotRenderedPage.viewAs.mode,
            haveContent: this.haveContent(this.dotRenderedPage)
        };
    }

    get canCreateTemplate(): boolean {
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

    /*
        To check if a page have content we need to check the containers inside the layout
        and map that with all the containers in the page and get the contentlet from there.

        We can't check directly the containers object because we can have containers with
        contentlets there but if they're not in the layout they're not showing and that's
        because you can remove a container from a page but if you added back it need to
        show the contentlet it had.
    */
    private haveContent(page: DotPageRender): boolean {
        const pageContainers = page.containers;
        const rows = page.layout.body.rows;

        for (let i = 0; i < rows.length; i++) {
            const columns = rows[i].columns;
            if (this.haveContentlets(columns, pageContainers)) {
                return true;
            }
        }
        return false;
    }

    private haveContentlets(columns: DotLayoutColumn[], pageContainers: any): boolean {
        return columns.some((column: DotLayoutColumn) => {
            return column.containers.some(({ identifier, uuid }: DotPageContainer) => {
                return pageContainers[identifier].contentlets[`uuid-${uuid}`].length;
            });
        });
    }
}
