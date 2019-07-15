import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { DotPersonaSelector2Component } from './dot-persona-selector2.component';

@NgModule({
    declarations: [DotPersonaSelector2Component],
    exports: [DotPersonaSelector2Component],
    imports: [CommonModule, FormsModule, SearchableDropDownModule],
})
export class DotPersonaSelector2Module {}
