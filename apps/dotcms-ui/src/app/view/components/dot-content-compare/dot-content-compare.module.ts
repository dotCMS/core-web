import { NgModule } from '@angular/core';
import { DotContentCompareComponent } from '@components/dot-content-compare/dot-content-compare.component';
import { CommonModule } from '@angular/common';
import { DotContentCompareTableComponent } from '@components/dot-content-compare/components/dot-content-compare-table/dot-content-compare-table.component';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';

@NgModule({
    declarations: [DotContentCompareComponent, DotContentCompareTableComponent],
    exports: [DotContentCompareComponent],
    imports: [CommonModule, DotDialogModule]
})
export class DotContentCompareModule {}
