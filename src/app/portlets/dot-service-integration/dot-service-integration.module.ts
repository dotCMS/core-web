import { NgModule } from '@angular/core';

import { DotServiceIntegrationRoutingModule } from './dot-service-integration-routing.module';
import { DotServiceIntegrationListModule } from './dot-service-integration-list/dot-service-integration-list.module';
import { DotServiceIntegrationConfigurationListModule } from './dot-service-integration-configuration-list/dot-service-integration-configuration-list.module';
import { DotServiceIntegrationDetailModule } from './dot-service-integration-detail/dot-service-integration-detail.module';

@NgModule({
    imports: [
        DotServiceIntegrationListModule,
        DotServiceIntegrationDetailModule,
        DotServiceIntegrationConfigurationListModule,
        DotServiceIntegrationRoutingModule
    ]
})
export class DotServiceIntegrationModule {}
