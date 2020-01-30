import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule, ButtonModule } from 'primeng/primeng';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { DotServiceIntegrationConfigurationListComponent } from './dot-service-integration-configuration-list.component';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';

@NgModule({
    imports: [
        InputTextModule,
        ButtonModule,
        CommonModule,
        DotIconButtonModule,
        VirtualScrollerModule
    ],
    declarations: [DotServiceIntegrationConfigurationListComponent],
    exports: [DotServiceIntegrationConfigurationListComponent]
})
export class DotServiceIntegrationConfigurationListModule {}
