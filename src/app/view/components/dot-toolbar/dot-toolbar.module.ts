import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule, ButtonModule } from 'primeng/primeng';

import { DotToolbarComponent } from './dot-toolbar.component';
import { DotToolbarNotificationsComponent } from './components/dot-toolbar-notifications/dot-toolbar-notifications';
import { DotToolbarUserComponent } from './components/dot-toolbar-user/dot-toolbar-user';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotCrumbtrailModule } from '@components/dot-crumbtrail/dot-crumbtrail.module';
import { DotGlobalMessageModule } from '@components/_common/dot-global-message/dot-global-message.module';
import { DotSiteSelectorModule } from '@components/_common/dot-site-selector/dot-site-selector.module';
import { DotDropdownModule } from '@components/_common/dot-dropdown-component/dot-dropdown.module';
import {
    DotNotificationsListComponent,
    DotNotificationsItemComponent
} from './components/dot-notifications/dot-notifications.component';
import { DotCustomTimeModule } from '@components/_common/dot-custom-time.component/dot-custom-time.module';
import { DotGravatarModule } from './components/dot-gravatar/dot-gravatar.module';
import { DotLoginAsModule } from './components/dot-login-as/dot-login-as.module';
import { DotMyAccountModule } from './components/dot-my-account/dot-my-account.module';

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
        DotCrumbtrailModule,
        DotCustomTimeModule,
        DotDropdownModule,
        DotGlobalMessageModule,
        DotGravatarModule,
        DotIconButtonModule,
        DotLoginAsModule,
        DotMyAccountModule,
        DotSiteSelectorModule,
        ToolbarModule
    ],
    declarations: [
        DotToolbarUserComponent,
        DotToolbarNotificationsComponent,
        DotToolbarComponent,
        DotNotificationsListComponent,
        DotNotificationsItemComponent
    ],
    exports: [DotToolbarComponent]
})
export class DotToolbarModule {}
