import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, take } from 'rxjs/operators';
import { DotToolGroupService } from '@services/dot-tool-group/dot-tool-group.service';
import { DotCurrentUser, DotPermissionsType } from '@models/dot-current-user/dot-current-user';
import { PermissionsType } from '@services/dot-current-user/dot-current-user.service';

@Component({
    selector: 'dot-starter',
    templateUrl: './dot-starter.component.html',
    styleUrls: ['./dot-starter.component.scss']
})
export class DotStarterComponent implements OnInit {
    username: string;
    showCreateContentLink: boolean;
    showCreateDataModelLink: boolean;
    showCreatePageLink: boolean;
    showCreateTemplateLink: boolean;

    constructor(private route: ActivatedRoute, private dotToolGroupService: DotToolGroupService) {}

    ngOnInit() {
        this.route.data
            .pipe(pluck('userData'), take(1))
            .subscribe(([currentUser, userPermissions]: [DotCurrentUser, DotPermissionsType]) => {
                this.username = currentUser.givenName;
                this.showCreateContentLink = userPermissions[PermissionsType.CONTENTLETS].canWrite;
                this.showCreateDataModelLink = userPermissions[PermissionsType.STRUCTURES].canWrite;
                this.showCreatePageLink = userPermissions[PermissionsType.HTMLPAGES].canWrite;
                this.showCreateTemplateLink = userPermissions[PermissionsType.TEMPLATES].canWrite;
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
}
