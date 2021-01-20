import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, take } from 'rxjs/operators';
import { DotToolGroupService } from '@services/dot-tool-group/dot-tool-group.service';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Component({
    selector: 'dot-starter',
    templateUrl: './dot-starter.component.html',
    styleUrls: ['./dot-starter.component.scss']
})
export class DotStarterComponent implements OnInit {
    username: string;

    portletKeyLink = {
        'starter.main.link.data.model': '/content-types-angular/create/content',
        'starter.main.link.add.content': '/c/content/new/webPageContent',
        'starter.main.link.design.layout': '/templates/new/designer',
        'starter.main.link.create.page': '/c/content/new/htmlpageasset'
    };

    constructor(
        private route: ActivatedRoute,
        private dotToolGroupService: DotToolGroupService,
        private dotRouterService: DotRouterService
    ) {}

    ngOnInit() {
        this.route.data.pipe(pluck('username'), take(1)).subscribe((username: string) => {
            this.username = username;
        });
    }

    /**
     * Hit the endpoint to show/hide the tool group in the menu.
     * @param {boolean} hide
     * @memberof DotStarterComponent
     */
    handleVisibility(hide: boolean): void {
        const layoutId = 'gettingstarted';
        hide
            ? this.dotToolGroupService.hide(layoutId).pipe(take(1)).subscribe()
            : this.dotToolGroupService.show(layoutId).pipe(take(1)).subscribe();
    }

    /**
     * Redirects to the portlet passed.
     * @param {string} key
     * @memberof DotStarterComponent
     */
    gotoPortlet(key: string): void {
        this.dotRouterService.goToURL(this.portletKeyLink[key]);
    }
}
