import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotAppsConfigurationItemComponent } from './dot-apps-configuration-item.component';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { TooltipModule } from 'primeng/primeng';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [
        CommonModule,
        DotIconButtonModule,
        DotIconModule,
        TooltipModule,
        DotDirectivesModule
    ],
    declarations: [DotAppsConfigurationItemComponent],
    exports: [DotAppsConfigurationItemComponent]
})
export class DotAppsConfigurationItemModule {}
