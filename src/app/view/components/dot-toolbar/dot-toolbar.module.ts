import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule, ButtonModule } from 'primeng/primeng';

import { DotCrumbtrailModule } from '@components/dot-crumbtrail/dot-crumbtrail.module';
import { DotDropdownModule } from '@components/_common/dot-dropdown-component/dot-dropdown.module';
import { DotGlobalMessageModule } from '@components/_common/dot-global-message/dot-global-message.module';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotSiteSelectorModule } from '@components/_common/dot-site-selector/dot-site-selector.module';
import { DotToolbarComponent } from './dot-toolbar.component';
import { DotToolbarNotificationModule } from './components/dot-toolbar-notifications/dot-toolbar-notifications.module';
import { DotToolbarUserModule } from './components/dot-toolbar-user/dot-toolbar-user.module';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        DotCrumbtrailModule,
        DotDropdownModule,
        DotGlobalMessageModule,
        DotIconButtonModule,
        DotSiteSelectorModule,
        DotToolbarNotificationModule,
        DotToolbarUserModule,
        ToolbarModule
    ],
    declarations: [DotToolbarComponent],
    exports: [DotToolbarComponent]
})
export class DotToolbarModule {}
