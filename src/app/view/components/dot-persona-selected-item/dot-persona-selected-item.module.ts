import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DotPersonaSelectedItemComponent } from './dot-persona-selected-item.component';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { TooltipModule, ButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        DotAvatarModule,
        DotIconModule,
        FormsModule,
        TooltipModule
    ],
    declarations: [DotPersonaSelectedItemComponent],
    exports: [DotPersonaSelectedItemComponent]
})
export class DotPersonaSelectedItemModule {}
