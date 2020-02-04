import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/primeng';

import { DotServiceIntegrationConfigurationListComponent } from './dot-service-integration-configuration-list.component';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        DotIconButtonModule,
    ],
    declarations: [DotServiceIntegrationConfigurationListComponent],
    exports: [DotServiceIntegrationConfigurationListComponent]
})
export class DotServiceIntegrationConfigurationListModule {}
