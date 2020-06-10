import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule, InputSwitchModule } from 'primeng/primeng';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotKeyValueTableRowComponent } from './dot-key-value-table-row.component';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        FormsModule,
        TableModule,
        DotIconButtonModule,
        DotDirectivesModule
    ],
    exports: [DotKeyValueTableRowComponent],
    declarations: [DotKeyValueTableRowComponent]
})
export class DotKeyValueTableRowModule {}
