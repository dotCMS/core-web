import { AfterViewInit, Component, ElementRef, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotSiteSelectorComponent } from '@components/_common/dot-site-selector/dot-site-selector.component';
import { SearchableDropdownComponent } from '@components/_common/searchable-dropdown/component';
import { DotTheme } from '@models/dot-edit-layout-designer';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { PaginatorService } from '@services/paginator';
import { Site, SiteService } from 'dotcms-js';
import { LazyLoadEvent } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, take } from 'rxjs/operators';

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
export class DotThemeSelectorDropdownComponent
    implements OnInit, ControlValueAccessor, AfterViewInit {
    themes: DotTheme[] = [];
    value: DotTheme = null;
    totalRecords: number = 0;
    currentOffset: number;
    currentSiteIdentifier: string;

    @ViewChild('searchableDropdown', { static: true })
    searchableDropdown: SearchableDropdownComponent;

    @ViewChild('searchInput', { static: false })
    searchInput: ElementRef;

    @ViewChild('siteSelector')
    siteSelector: DotSiteSelectorComponent;

    constructor(
        public readonly paginatorService: PaginatorService,
        private readonly siteService: SiteService,
        private readonly themesService: DotThemesService
    ) {}

    ngOnInit(): void {
        this.siteService
            .getCurrentSite()
            .pipe(pluck('identifier'), take(1))
            .subscribe((identifier: string) => {
                this.currentSiteIdentifier = identifier;
            });
    }

    ngAfterViewInit(): void {
        if (this.searchInput) {
            fromEvent(this.searchInput.nativeElement, 'keyup')
                .pipe(debounceTime(500))
                .subscribe((keyboardEvent: KeyboardEvent) => {
                    this.getFilteredThemes(keyboardEvent.target['value']);
                });
        }
    }

    onHide(): void {
        if (this.value) {
            this.siteService
                .getSiteById(this.value.hostId)
                .pipe(take(1))
                .subscribe((site) => {
                    this.siteSelector.setCurrentSiteAsDefault(site);
                });
        }

        // Reset back to its original state
        this.searchInput.nativeElement.value = '';
        this.setHostThemes(this.currentSiteIdentifier);
        this.getFilteredThemes('');
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
     * @param {string} identifier
     * @memberof DotThemeSelectorDropdownComponent
     */
    writeValue(identifier: string): void {
        if (identifier) {
            this.themesService
                .get(identifier)
                .pipe(take(1))
                .subscribe((theme: DotTheme) => {
                    this.value = theme;
                    this.siteService.getSiteById(this.value.hostId).subscribe((site) => {
                        this.siteSelector.setCurrentSiteAsDefault(site);
                    });
                });
        }
    }
    /**
     *  Sets the themes on site host change
     *
     * @param {Site} event
     * @memberof DotThemeSelectorDropdownComponent
     */
    siteChange(event: Site): void {
        this.currentSiteIdentifier = event.identifier;
        this.setHostThemes(event.identifier);
    }
    /**
     * Sets the themes when the drop down is opened
     *
     * @memberof DotThemeSelectorDropdownComponent
     */
    onShow(): void {
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.paginationPerPage = 5;

        if (!this.value) {
            this.setHostThemes(this.currentSiteIdentifier);
        } else {
            this.setHostThemes(this.value.hostId);
            this.currentSiteIdentifier = this.value.hostId;
        }
    }

    /**
     * Handles the onChange behavior of the select input
     *
     * @param {DotTheme} theme
     * @memberof DotThemeSelectorDropdownComponent
     */
    onChange(theme: DotTheme) {
        this.value = theme;
        this.propagateChange(theme.identifier);
        this.searchableDropdown.toggleOverlayPanel();
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

    /**
     * Handles page change for pagination purposes.
     *
     * @param {LazyLoadEvent} event
     * @return void
     * @memberof DotThemeSelectorDropdownComponent
     */
    handlePageChange(event: LazyLoadEvent): void {
        this.currentOffset = event.first;
        if (this.currentSiteIdentifier) {
            this.paginatorService
                .getWithOffset(event.first)
                .pipe(take(1))
                .subscribe((themes) => {
                    this.themes = themes;
                });
        }
    }

    private getFilteredThemes(filter = '', offset = 0): void {
        this.paginatorService.searchParam = filter;
        this.setHostThemes(this.currentSiteIdentifier, this.currentOffset || offset);
    }

    private setHostThemes(hostId: string, offset: number = 0) {
        this.paginatorService.setExtraParams('hostId', hostId);
        this.paginatorService
            .getWithOffset(offset)
            .pipe(take(1))
            .subscribe((themes: DotTheme[]) => {
                this.themes = themes;
                this.setTotalRecords();
            });
    }

    private setTotalRecords() {
        this.totalRecords = this.paginatorService.totalRecords;
    }
}
