import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PushPublishContentTypesDialogComponent } from './push-publish-dialog.component';
import { CalendarModule, DialogModule, DropdownModule, CheckboxModule } from 'primeng/primeng';
import { PushPublishEnvSelectorModule } from '../dot-push-publish-env-selector/dot-push-publish-env-selector.module';
import { FieldValidationMessageModule } from '../field-validation-message/file-validation-message.module';


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
        DropdownModule,
        FieldValidationMessageModule,
        CheckboxModule
    ]
})

export class PushPublishContentTypesDialogModule {}
