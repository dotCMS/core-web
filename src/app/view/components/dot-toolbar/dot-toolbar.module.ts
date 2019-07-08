import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule, ButtonModule } from 'primeng/primeng';

import { ToolbarComponent } from './dot-toolbar.component';
import { ToolbarNotificationsComponent } from './components/toolbar-notifications/toolbar-notifications';
import { ToolbarUserComponent } from './components/toolbar-user/toolbar-user';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotCrumbtrailModule } from '@components/dot-crumbtrail/dot-crumbtrail.module';
import { DotGlobalMessageModule } from '@components/_common/dot-global-message/dot-global-message.module';
import { SiteSelectorModule } from '@components/_common/site-selector/site-selector.module';
import { DotDropdownModule } from '@components/_common/dropdown-component/dot-dropdown.module';
import {
    NotificationsListComponent,
    NotificationsItemComponent
} from './components/notifications/notifications';
import { DotCustomTimeModule } from '@components/_common/dot-custom-time.component/dot-custom-time.module';
import { DotGravatarModule } from './components/gravatar/dot-gravatar.module';
import { LoginAsModule } from './components/login-as/login-as.module';
import { DotMyAccountModule } from './components/my-account/dot-my-account.module';

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
        DotMyAccountModule,
        LoginAsModule,
        SiteSelectorModule,
        ToolbarModule
    ],
    declarations: [
        NotificationsItemComponent,
        NotificationsListComponent,
        ToolbarComponent,
        ToolbarNotificationsComponent,
        ToolbarUserComponent
    ],
    exports: [ToolbarComponent]
})
export class DotToolbarModule {}
