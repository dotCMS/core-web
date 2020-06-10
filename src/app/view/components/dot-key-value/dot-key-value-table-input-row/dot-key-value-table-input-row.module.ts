import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule, InputSwitchModule } from 'primeng/primeng';
import { DotKeyValueTableInputRowComponent } from './dot-key-value-table-input-row.component';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        FormsModule,
        DotDirectivesModule
    ],
    exports: [DotKeyValueTableInputRowComponent],
    declarations: [DotKeyValueTableInputRowComponent]
})
export class DotKeyValueTableInputRowModule {}
