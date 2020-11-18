import { Component, OnInit } from '@angular/core';
import { DotTheme } from '@portlets/dot-edit-page/shared/models';
import { PaginatorService } from '@services/paginator';
import { SiteService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';

@Component({
    selector: 'dot-dot-theme-selector-dropdown',
    templateUrl: './dot-theme-selector-dropdown.component.html',
    styleUrls: ['./dot-theme-selector-dropdown.component.scss']
})
export class DotThemeSelectorDropdownComponent implements OnInit {
    themes: DotTheme[] = [];
    currentSiteHostId$: Observable<string>;
    value: DotTheme;

    placeholder = 'Select Themes';

    constructor(
        private readonly paginatorService: PaginatorService,
        private readonly siteService: SiteService
    ) {}

    ngOnInit(): void {
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.paginationPerPage = 4;
        this.siteService
            .getCurrentSite()
            .pipe(take(1), pluck('identifier'))
            .subscribe((identifier) => {
                this.setThemes(identifier);
            });
    }

    setThemes(identifier: string) {
        this.paginatorService.setExtraParams('hostId', identifier);
        this.paginatorService
            .getWithOffset(0)
            .pipe(take(1))
            .subscribe((themes) => {
                console.log(themes);
                this.themes = themes;
            });
    }
}
