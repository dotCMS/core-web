import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PushPublishDialogComponent } from './push-publish-dialog.component';
import { CalendarModule, DialogModule, RadioButtonModule } from 'primeng/primeng';
import { PushPublishEnvSelectorModule } from '../dot-push-publish-env-selector/dot-push-publish-env-selector.module';


@NgModule({
    declarations: [
        PushPublishDialogComponent,
    ],
    exports: [
        PushPublishDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        DialogModule,
        RadioButtonModule,
        PushPublishEnvSelectorModule
    ]
})

export class PushPublishDialogModule {}
