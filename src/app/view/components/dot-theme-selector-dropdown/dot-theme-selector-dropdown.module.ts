import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotThemeSelectorDropdownComponent } from './dot-theme-selector-dropdown.component';
import { PaginatorService } from '@services/paginator';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';

@NgModule({
    declarations: [DotThemeSelectorDropdownComponent],
    exports: [DotThemeSelectorDropdownComponent],
    providers: [PaginatorService],
    imports: [CommonModule, SearchableDropDownModule]
})
export class DotThemeSelectorDropdownModule {}
