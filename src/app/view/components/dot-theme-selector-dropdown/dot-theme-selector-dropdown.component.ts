import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DotTheme } from '@portlets/dot-edit-page/shared/models';
import { PaginatorService } from '@services/paginator';
import { SiteService } from 'dotcms-js';
import { Observable } from 'rxjs';
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
    currentSiteHostId$: Observable<string>;
    value: DotTheme;
    totalRecords: number = 0;
    placeholder = 'Select Themes';
    currentSiteIdentifier: string;

    // 1. Crear una propiedad privada para manejar el value del host id
    // 2. Usar esa propiedad para setear en el searchable dropdown el valor actual [ngModel]

    @Output()
    change = new EventEmitter<string>();

    constructor(
        private readonly paginatorService: PaginatorService,
        private readonly siteService: SiteService
    ) {}

    propagateChange = (_: any) => {};

    /**
     * Set the function to be called when the control receives a change event.
     * @param any fn
     * @memberof SearchableDropdownComponent
     */
    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {}

    writeValue(value: string): void {
        console.log(value);
        console.log(this.themes);
    }

    ngOnInit(): void {
        this.paginatorService.url = 'v1/themes';
        this.paginatorService.paginationPerPage = 5;

        this.siteService
            .getCurrentSite()
            .pipe(
                take(1),
                pluck('identifier'),
                mergeMap((identifier) => {
                    this.paginatorService.setExtraParams('hostId', identifier);
                    return this.paginatorService.getWithOffset(0).pipe(take(1));
                })
            )
            .subscribe((themes) => {
                this.themes = themes;
                this.totalRecords = this.paginatorService.totalRecords;
            });
    }

    onChange({ identifier }: DotTheme) {
        this.change.emit(identifier);
        this.propagateChange(identifier);
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
