import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DotTheme } from '@portlets/dot-edit-page/shared/models';
import { PaginatorService } from '@services/paginator';
import { SiteService } from 'dotcms-js';
import { Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';

@Component({
    selector: 'dot-theme-selector-dropdown',
    templateUrl: './dot-theme-selector-dropdown.component.html',
    styleUrls: ['./dot-theme-selector-dropdown.component.scss']
})
export class DotThemeSelectorDropdownComponent implements OnInit {
    themes: DotTheme[] = [];
    currentSiteHostId$: Observable<string>;
    value: DotTheme;
    totalRecords: number = 0;
    placeholder = 'Select Themes';
    currentSiteIdentifier: string;

    @Output()
    change = new EventEmitter<string>();

    constructor(
        private readonly paginatorService: PaginatorService,
        private readonly siteService: SiteService
    ) {}

    ngOnInit(): void {
        this.paginatorService.url = 'v1/themes';
        this.siteService
            .getCurrentSite()
            .pipe(take(1), pluck('identifier'))
            .subscribe((identifier) => {
                this.currentSiteIdentifier = identifier;
                this.setThemesWithOffset(5);
            });
    }

    onChange({ identifier }: DotTheme) {
        this.change.emit(identifier);
    }

    setThemesWithOffset(perPage: number): void {
        this.paginatorService.paginationPerPage = perPage;
        this.paginatorService.setExtraParams('hostId', this.currentSiteIdentifier);

        this.paginatorService
            .getWithOffset(0)
            .pipe(take(1))
            .subscribe((themes) => {
                this.themes = themes;
                this.totalRecords = this.paginatorService.totalRecords;
            });
    }

    handlePageChange(event: any): void {
        if (!this.currentSiteIdentifier) return;
        console.log({ event });
        this.paginatorService
            .getWithOffset(event.first)
            .pipe(take(1))
            .subscribe((themes) => {
                this.themes = themes;
            });
    }

    handleFilterChange(filter: string): void {
        this.getFilteredThemes(filter);
    }

    private getFilteredThemes(filter = '', offset = 0): void {
        this.paginatorService.searchParam = filter;
        this.paginatorService.paginationPerPage = 40;
        this.paginatorService.getWithOffset(offset).subscribe((themes) => {
            this.themes = themes;
            this.totalRecords = this.paginatorService.totalRecords;
        });
    }
}
