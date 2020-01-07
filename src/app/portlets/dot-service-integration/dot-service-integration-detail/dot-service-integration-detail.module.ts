import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/primeng';

import { DotServiceIntegrationDetailComponent } from './dot-service-integration-detail.component';

@NgModule({
    imports: [InputTextModule, CommonModule],
    declarations: [DotServiceIntegrationDetailComponent],
    exports: [DotServiceIntegrationDetailComponent],
})
export class DotServiceIntegrationDetailModule {}
