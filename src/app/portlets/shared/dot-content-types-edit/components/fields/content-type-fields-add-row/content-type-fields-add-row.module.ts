import { ButtonModule, TooltipModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/splitbutton';
import { HotkeysService } from 'angular2-hotkeys';
import { ContentTypeFieldsAddRowComponent } from './content-type-fields-add-row.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    declarations: [ContentTypeFieldsAddRowComponent],
    exports: [ContentTypeFieldsAddRowComponent],
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        DotIconButtonModule,
        SplitButtonModule,
        DotDirectivesModule
    ],
    providers: [HotkeysService]
})
export class ContentTypeFieldsAddRowModule {}
