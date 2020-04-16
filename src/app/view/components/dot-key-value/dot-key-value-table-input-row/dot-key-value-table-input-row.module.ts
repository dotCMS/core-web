import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule, InputSwitchModule } from 'primeng/primeng';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotKeyValueTableInputRowComponent } from './dot-key-value-table-input-row.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        FormsModule,
        TableModule,
        DotIconButtonModule
    ],
    exports: [DotKeyValueTableInputRowComponent],
    declarations: [DotKeyValueTableInputRowComponent]
})
export class DotKeyValueTableInputRowModule {}
