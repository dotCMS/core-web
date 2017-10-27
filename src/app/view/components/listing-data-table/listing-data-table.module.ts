import { IconButtonTooltipModule } from './../_common/icon-button-tooltip/icon-button-tooltip.module';
import { ActionHeaderModule } from './action-header/action-header.module';
import { CommonModule } from '@angular/common';
import { CrudService } from '../../../api/services/crud/crud.service';
import { DotcmsConfig, LoggerService } from 'dotcms-js/dotcms-js';
import { FormsModule } from '@angular/forms';
import { FormatDateService } from '../../../api/services/format-date-service';
import { ListingDataTableComponent } from './listing-data-table.component';
import { MessageService } from '../../../api/services/messages-service';
import { NgModule } from '@angular/core';
import { DataTableModule, InputTextModule, ButtonModule, SplitButtonModule, MenuModule } from 'primeng/primeng';
import { ActionMenuButtonModule } from './../_common/action-menu-button/action-menu-button.module';

@NgModule({
    declarations: [
        ListingDataTableComponent
    ],
    exports: [
        ListingDataTableComponent
    ],
    imports: [
        ActionHeaderModule,
        CommonModule,
        DataTableModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        IconButtonTooltipModule,
        ActionMenuButtonModule,
        MenuModule
    ],
    providers: [
        CrudService,
        FormatDateService,
        DotcmsConfig,
        LoggerService,
        MessageService,
    ]
})
export class ListingDataTableModule {}
