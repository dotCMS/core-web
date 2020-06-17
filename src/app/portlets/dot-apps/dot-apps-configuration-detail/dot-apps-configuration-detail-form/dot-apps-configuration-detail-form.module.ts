import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    CheckboxModule,
    InputTextareaModule,
    InputTextModule,
    TooltipModule,
    DropdownModule
} from 'primeng/primeng';

import { DotAppsConfigurationDetailFormComponent } from './dot-apps-configuration-detail-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotFileUploadModule } from '@components/dot-file-upload/dot-file-upload.module';

@NgModule({
    imports: [
        CheckboxModule,
        CommonModule,
        DotIconModule,
        DotFileUploadModule,
        DropdownModule,
        InputTextareaModule,
        InputTextModule,
        ReactiveFormsModule,
        TooltipModule
    ],
    declarations: [DotAppsConfigurationDetailFormComponent],
    exports: [DotAppsConfigurationDetailFormComponent],
    providers: []
})
export class DotAppsConfigurationDetailFormModule {}
