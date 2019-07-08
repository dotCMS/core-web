import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchableDropDownModule } from '../searchable-dropdown/searchable-dropdown.module';
import { DotSiteSelectorComponent } from './dot-site-selector.component';
import { PaginatorService } from '@services/paginator';

@NgModule({
    declarations: [DotSiteSelectorComponent],
    providers: [PaginatorService],
    exports: [DotSiteSelectorComponent],
    imports: [CommonModule, FormsModule, SearchableDropDownModule]
})
export class DotSiteSelectorModule {}
