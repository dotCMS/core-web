import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/primeng';

import { DotServiceIntegrationListComponent } from './dot-service-integration.component';
import { DotServiceIntegrationCardModule } from './dot-service-integration-card/dot-service-integration-card.module';

@NgModule({
    imports: [InputTextModule, CommonModule, DotServiceIntegrationCardModule],
    declarations: [DotServiceIntegrationListComponent],
    exports: [DotServiceIntegrationListComponent]
})
export class DotServiceIntegrationListModule {}
