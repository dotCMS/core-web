import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DotKeyValueComponent } from './dot-key-value.component';
import { DotKeyValueTableRowModule } from '@components/dot-key-value/dot-key-value-table-row/dot-key-value-table-row.module';

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        DotKeyValueTableRowModule
    ],
    exports: [DotKeyValueComponent],
    providers: [],
    declarations: [DotKeyValueComponent]
})
export class DotKeyValueModule {}
