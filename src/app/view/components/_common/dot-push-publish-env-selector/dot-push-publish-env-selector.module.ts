import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PushPublishEnvSelectorComponent } from './dot-push-publish-env-selector.component';
import { DataListModule, DropdownModule } from 'primeng/primeng';


@NgModule({
    declarations: [
        PushPublishEnvSelectorComponent,
    ],
    exports: [
        PushPublishEnvSelectorComponent
    ],
    imports: [
        CommonModule,
        DataListModule,
        DropdownModule
    ]
})

export class PushPublishEnvSelectorModule {}
