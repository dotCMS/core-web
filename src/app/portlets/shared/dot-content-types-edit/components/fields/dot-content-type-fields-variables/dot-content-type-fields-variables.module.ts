import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DotFieldVariablesService } from './services/dot-field-variables.service';
import { DotActionButtonModule } from '@components/_common/dot-action-button/dot-action-button.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotContentTypeFieldsVariablesComponent } from './dot-content-type-fields-variables.component';
// tslint:disable-next-line:max-line-length
import { DotContentTypeFieldsVariablesTableRowModule } from './components/dot-content-type-fields-variables-table-row/dot-content-type-fields-variables-table-row.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        TableModule,
        DotActionButtonModule,
        DotIconButtonModule,
        DotContentTypeFieldsVariablesTableRowModule
    ],
    exports: [DotContentTypeFieldsVariablesComponent],
    providers: [DotFieldVariablesService],
    declarations: [DotContentTypeFieldsVariablesComponent]
})
export class DotContentTypeFieldsVariablesModule {}
