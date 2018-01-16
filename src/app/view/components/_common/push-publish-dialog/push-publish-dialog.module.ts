import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PushPublishContentTypesDialogComponent } from './push-publish-dialog.component';
import { CalendarModule, DialogModule, DropdownModule } from 'primeng/primeng';
import { PushPublishEnvSelectorModule } from '../dot-push-publish-env-selector/dot-push-publish-env-selector.module';


@NgModule({
    declarations: [
        PushPublishContentTypesDialogComponent
    ],
    exports: [
        PushPublishContentTypesDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        DialogModule,
        PushPublishEnvSelectorModule,
        ReactiveFormsModule,
        DropdownModule
    ]
})

export class PushPublishContentTypesDialogModule {}
