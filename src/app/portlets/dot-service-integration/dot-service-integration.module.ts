import { NgModule } from '@angular/core';

import { DotServiceIntegrationRoutingModule } from './dot-service-integration-routing.module';
import { DotServiceIntegrationListModule } from './dot-service-integration-list/dot-service-integration-list.module';
import { DotServiceIntegrationConfigurationModule } from './dot-service-integration-configuration/dot-service-integration-configuration.module';
import { DotServiceIntegrationConfigurationDetailModule } from './dot-service-integration-configuration-detail/dot-service-integration-configuration-detail.module';

@NgModule({
    imports: [
        DotServiceIntegrationListModule,
        DotServiceIntegrationConfigurationModule,
        DotServiceIntegrationConfigurationDetailModule,
        DotServiceIntegrationRoutingModule
    ]
})
export class DotServiceIntegrationModule {}
