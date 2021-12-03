import { NgModule } from '@angular/core';
import { DotContentCompareComponent } from '@components/dot-content-compare/dot-content-compare.component';
import { CommonModule } from '@angular/common';
import { DotContentCompareTableComponent } from '@components/dot-content-compare/components/dot-content-compare-table/dot-content-compare-table.component';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotContentCompareDialogComponent } from './components/dot-content-compare-dialog/dot-content-compare-dialog.component';
import { TableModule } from 'primeng/table';
import { DotCompareFieldComponent } from './components/dot-compare-field/dot-compare-field.component';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
    declarations: [
        DotContentCompareComponent,
        DotContentCompareTableComponent,
        DotContentCompareDialogComponent,
        DotContentCompareDialogComponent,
        DotCompareFieldComponent
    ],
    exports: [DotContentCompareComponent, DotContentCompareDialogComponent],
    imports: [CommonModule, DotDialogModule, TableModule, DropdownModule, SelectButtonModule]
})
export class DotContentCompareModule {}
