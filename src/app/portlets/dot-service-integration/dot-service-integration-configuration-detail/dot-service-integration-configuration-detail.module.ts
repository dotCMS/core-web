import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ButtonModule,
    CheckboxModule,
    InputTextareaModule,
    InputTextModule
} from 'primeng/primeng';

import { DotServiceIntegrationConfigurationDetailComponent } from './dot-service-integration-configuration-detail.component';
import { DotServiceIntegrationService } from '@services/dot-service-integration/dot-service-integration.service';
import { DotServiceIntegrationConfigurationDetailResolver } from './dot-service-integration-configuration-detail-resolver.service';
import { DotCopyButtonModule } from '@components/dot-copy-button/dot-copy-button.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        ButtonModule,
        CheckboxModule,
        CommonModule,
        DotCopyButtonModule,
        InputTextareaModule,
        InputTextModule,
        ReactiveFormsModule
    ],
    declarations: [DotServiceIntegrationConfigurationDetailComponent],
    exports: [DotServiceIntegrationConfigurationDetailComponent],
    providers: [DotServiceIntegrationService, DotServiceIntegrationConfigurationDetailResolver]
})
export class DotServiceIntegrationConfigurationDetailModule {}
