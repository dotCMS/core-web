import { NgModule } from '@angular/core';
import { DotContentCompareComponent } from '@components/dot-content-compare/dot-content-compare.component';
import { CommonModule } from '@angular/common';
import { DotContentCompareTableComponent } from '@components/dot-content-compare/components/dot-content-compare-table/dot-content-compare-table.component';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotContentCompareDialogComponent } from './components/dot-content-compare-dialog/dot-content-compare-dialog.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DotContentCompareFileFieldComponent } from './components/fields/dot-content-compare-file-field/dot-content-compare-file-field.component';
import { DotContentCompareBinaryFieldComponent } from './components/fields/dot-content-compare-binary-field/dot-content-compare-binary-field.component';
import { DotContentCompareDateFieldComponent } from './components/fields/dot-content-compare-date-field/dot-content-compare-date-field.component';
import { DotContentletService } from '@services/dot-contentlet/dot-contentlet.service';
import { DotDiffPipeModule } from '@pipes/dot-diff/dot-diff.pipe.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DotContentCompareComponent,
        DotContentCompareTableComponent,
        DotContentCompareDialogComponent,
        DotContentCompareDialogComponent,
        DotContentCompareFileFieldComponent,
        DotContentCompareBinaryFieldComponent,
        DotContentCompareDateFieldComponent
    ],
    exports: [DotContentCompareComponent, DotContentCompareDialogComponent],
    imports: [
        CommonModule,
        DotDialogModule,
        TableModule,
        DropdownModule,
        SelectButtonModule,
        DotDiffPipeModule,
        FormsModule
    ],
    providers: [DotContentletService]
})
export class DotContentCompareModule {}
