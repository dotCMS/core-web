import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule, TooltipModule } from 'primeng/primeng';

import { DotAppsCardComponent } from './dot-apps-card.component';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { NgxMdModule } from 'ngx-md';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [
        CommonModule,
        CardModule,
        DotAvatarModule,
        DotIconModule,
        NgxMdModule,
        TooltipModule,
        DotDirectivesModule
    ],
    declarations: [DotAppsCardComponent],
    exports: [DotAppsCardComponent]
})
export class DotAppsCardModule {}
