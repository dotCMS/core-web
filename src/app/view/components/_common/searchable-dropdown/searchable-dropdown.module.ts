import { SearchableDropdownComponent } from './component';
import { NgModule } from '@angular/core';
import { OverlayPanelModule, ButtonModule, InputTextModule } from 'primeng/primeng';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DotIconModule } from '../dot-icon/dot-icon.module';

export const SEARCHABLE_NGFACES_MODULES = [
    ButtonModule,
    CommonModule,
    DataViewModule,
    FormsModule,
    InputTextModule,
    OverlayPanelModule
];

@NgModule({
    declarations: [SearchableDropdownComponent],
    exports: [SearchableDropdownComponent],
    imports: [CommonModule, FormsModule, ...SEARCHABLE_NGFACES_MODULES, DotIconModule],
    providers: []
})
export class SearchableDropDownModule {}
