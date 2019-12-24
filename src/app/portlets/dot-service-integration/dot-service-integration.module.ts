import { NgModule } from '@angular/core';

import { DotServiceIntegrationRoutingModule } from './dot-service-integration-routing.module';
import { DotServiceIntegrationListModule } from './dot-service-integration-list/dot-service-integration.module';

@NgModule({
    imports: [DotServiceIntegrationListModule, DotServiceIntegrationRoutingModule]
})
export class DotServiceIntegrationModule {}
