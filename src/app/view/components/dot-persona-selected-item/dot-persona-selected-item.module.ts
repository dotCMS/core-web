import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DotPersonaSelectedItemComponent } from './dot-persona-selected-item.component';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/primeng';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DotIconModule,
        DotAvatarModule,
        ButtonModule,
        TooltipModule,
        DotDirectivesModule
    ],
    declarations: [DotPersonaSelectedItemComponent],
    exports: [DotPersonaSelectedItemComponent]
})
export class DotPersonaSelectedItemModule {}
