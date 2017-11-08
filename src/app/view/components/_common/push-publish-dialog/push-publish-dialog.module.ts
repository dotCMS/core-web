import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PushPublishDialogComponent } from './push-publish-dialog.component';
import { CalendarModule } from 'primeng/primeng';


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
        CalendarModule
    ]
})

export class PushPublishDialogModule {}
