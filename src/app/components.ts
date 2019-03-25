import { CustomTimeComponent } from './view/components/_common/custom-time/custom-time';
import { DotAlertConfirmComponent } from './view/components/_common/dot-alert-confirm/dot-alert-confirm';
import { GlobalSearchComponent } from './view/components/global-search/global-search';
import { DotLogOutContainerComponent } from '@components/login/dot-login-component/dot-log-out-container';
import { LoginAsComponent } from '@components/login-as/login-as';
import { MainCoreLegacyComponent } from '@components/main-core-legacy/main-core-legacy-component';
import { MainComponentLegacyComponent } from '@components/main-legacy/main-legacy.component';
import { MyAccountComponent } from '@components/my-account/dot-my-account-component';
import {
    NotificationsItemComponent,
    NotificationsListComponent
} from '@components/_common/notifications/notifications';
import { ToolbarComponent } from '@components/dot-toolbar/dot-toolbar.component';
import { ToolbarNotificationsComponent } from '@components/toolbar-notifications/toolbar-notifications';
import { ToolbarUserComponent } from '@components/toolbar-user/toolbar-user';

// CUSTOM PIPES
import { CapitalizePipe, SafePipe } from '@pipes/index';

export const COMPONENTS = [
    ToolbarUserComponent,
    ToolbarNotificationsComponent,
    ToolbarComponent,
    NotificationsListComponent,
    NotificationsItemComponent,
    MyAccountComponent,
    MainCoreLegacyComponent,
    MainComponentLegacyComponent,
    LoginAsComponent,
    DotLogOutContainerComponent,
    GlobalSearchComponent,
    DotAlertConfirmComponent,
    CustomTimeComponent
];

export const PIPES = [CapitalizePipe, SafePipe];
