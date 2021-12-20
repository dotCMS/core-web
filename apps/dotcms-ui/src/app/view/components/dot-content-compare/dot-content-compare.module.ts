import { NgModule } from '@angular/core';
import { DotContentCompareComponent } from '@components/dot-content-compare/dot-content-compare.component';
import { CommonModule } from '@angular/common';
import { DotContentCompareTableComponent } from '@components/dot-content-compare/components/dot-content-compare-table/dot-content-compare-table.component';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotContentCompareDialogComponent } from './components/dot-content-compare-dialog/dot-content-compare-dialog.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DotContentletService } from '@services/dot-contentlet/dot-contentlet.service';
import { DotDiffPipeModule } from '@pipes/dot-diff/dot-diff.pipe.module';
import { FormsModule } from '@angular/forms';
import { DotMessagePipeModule } from '@pipes/dot-message/dot-message-pipe.module';
import { DotContentComparePreviewFieldComponent } from '@components/dot-content-compare/components/fields/dot-content-compare-preview-field/dot-content-compare-preview-field.component';

@NgModule({
    declarations: [
        DotContentCompareComponent,
        DotContentCompareTableComponent,
        DotContentCompareDialogComponent,
        DotContentComparePreviewFieldComponent
    ],
    exports: [DotContentCompareDialogComponent],
    imports: [
        CommonModule,
        DotDialogModule,
        TableModule,
        DropdownModule,
        SelectButtonModule,
        FormsModule,
        DotMessagePipeModule,
        DotDiffPipeModule
    ],
    providers: [DotContentletService]
})
export class DotContentCompareModule {}
