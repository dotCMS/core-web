import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotTheme } from '@models/dot-edit-layout-designer';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { PaginatorService } from '@services/paginator';
import { SiteService } from 'dotcms-js';
import { LazyLoadEvent } from 'primeng/api';
import { mergeMap, pluck, take } from 'rxjs/operators';

@Component({
    selector: 'dot-theme-selector-dropdown',
    templateUrl: './dot-theme-selector-dropdown.component.html',
    styleUrls: ['./dot-theme-selector-dropdown.component.scss'],
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DotThemeSelectorDropdownComponent)
        }
    ]
})
export class DotThemeSelectorDropdownComponent implements OnInit, ControlValueAccessor {
    themes: DotTheme[] = [];
    value: DotTheme = null;
    totalRecords: number = 0;
    placeholder = 'Select Themes';
    currentSiteIdentifier: string;
    selectedTheme: string = '';
    currentOffset: number;

    constructor(
        private readonly paginatorService: PaginatorService,
        private readonly siteService: SiteService,
        private readonly themesService: DotThemesService
    ) {}

    ngOnInit(): void {
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.paginationPerPage = 5;

        this.siteService
            .getCurrentSite()
            .pipe(
                take(1),
                pluck('identifier'),
                mergeMap((identifier) => {
                    this.currentSiteIdentifier = identifier;
                    this.paginatorService.setExtraParams('hostId', identifier);
                    return this.paginatorService.getWithOffset(0).pipe(take(1));
                })
            )
            .subscribe((themes) => {
                this.themes = themes;
                this.totalRecords = this.paginatorService.totalRecords;
            });
    }

    propagateChange = (_: any) => {};
    registerOnTouched(): void {}

    /**
     * Set the function to be called when the control receives a change event.
     * @param any fn
     * @memberof SearchableDropdownComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    /**
     * Writes a new value to the element
     *
     * @param {DotTheme} theme
     * @memberof DotThemeSelectorDropdownComponent
     */
    writeValue(theme: DotTheme): void {
        this.value = theme;
    }

    /**
     * Handles the onChange from the searchable-dropdown
     *
     * @param {DotTheme} { identifier }
     * @memberof DotThemeSelectorDropdownComponent
     */
    onChange({ identifier }: DotTheme) {
        this.themesService
            .get(identifier)
            .pipe(take(1))
            .subscribe((theme) => {
                this.selectedTheme = theme.name;
                this.writeValue(theme);
            });
        this.propagateChange(identifier);
    }
    /**
     * Fetches a list of themes using an offset for pagination
     *
     * @param {LazyLoadEvent} event
     * @return void
     * @memberof DotThemeSelectorDropdownComponent
     */
    handlePageChange(event: LazyLoadEvent): void {
        if (!this.currentSiteIdentifier) return;

        this.currentOffset = event.first;

        this.paginatorService
            .getWithOffset(event.first)
            .pipe(take(1))
            .subscribe((themes) => {
                this.themes = themes;
            });
    }
    /**
     *  Fetch theme list via the DotThemeSelectorDropdownComponent input text
     *
     * @param {string} filter
     * @memberof DotThemeSelectorDropdownComponent
     */
    handleFilterChange(filter: string): void {
        this.getFilteredThemes(filter);
    }

    private getFilteredThemes(filter = '', offset = 0): void {
        this.paginatorService.searchParam = filter;
        this.paginatorService
            .getWithOffset(this.currentOffset || offset)
            .pipe(take(1))
            .subscribe((themes) => {
                this.themes = themes;
                this.totalRecords = this.paginatorService.totalRecords;
            });
    }
}
