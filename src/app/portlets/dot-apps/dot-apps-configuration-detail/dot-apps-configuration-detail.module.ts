import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ButtonModule,
    CheckboxModule,
    InputTextareaModule,
    InputTextModule
} from 'primeng/primeng';

import { DotAppsConfigurationDetailComponent } from './dot-apps-configuration-detail.component';
import { DotAppsService } from '@services/dot-apps/dot-apps.service';
import { DotAppsConfigurationDetailResolver } from './dot-apps-configuration-detail-resolver.service';
import { DotCopyButtonModule } from '@components/dot-copy-button/dot-copy-button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DotAppsConfigurationDetailFormModule } from './dot-apps-configuration-detail-form/dot-apps-configuration-detail-form.module';

@NgModule({
    imports: [
        ButtonModule,
        CheckboxModule,
        CommonModule,
        DotCopyButtonModule,
        InputTextareaModule,
        InputTextModule,
        ReactiveFormsModule,
        DotAppsConfigurationDetailFormModule
    ],
    declarations: [DotAppsConfigurationDetailComponent],
    exports: [DotAppsConfigurationDetailComponent],
    providers: [DotAppsService, DotAppsConfigurationDetailResolver]
})
export class DotAppsConfigurationDetailModule {}
